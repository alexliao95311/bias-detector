from dotenv import load_dotenv
load_dotenv(override=True)  # Load environment variables from .env

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import os
import logging
import aiohttp
import asyncio
import json
from bs4 import BeautifulSoup  # For web scraping

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI application
app = FastAPI()

@app.get("/")
async def root():
    return {"message": "FastAPI backend is running!"}

# Configure CORS with more permissive settings
backend_origin = os.getenv("BACKEND_ORIGIN", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # More permissive for testing
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["Content-Type", "Content-Length"],
)

# Global aiohttp session; will be created at startup.
session: aiohttp.ClientSession = None

@app.on_event("startup")
async def startup_event():
    global session
    # Configure session with timeouts to prevent hanging requests
    timeout = aiohttp.ClientTimeout(
        total=120,     # Increased total timeout
        connect=10,    # Connection timeout
        sock_read=60   # Increased socket read timeout
    )
    session = aiohttp.ClientSession(timeout=timeout)
    logger.info("Backend is up and running on port 8000!")

@app.on_event("shutdown")
async def shutdown_event():
    if session:
        await session.close()
    logger.info("Backend shutting down, session closed.")

# Custom exception handler for all exceptions
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global exception handler caught: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": f"An error occurred: {str(exc)}"},
    )

# Request model for analysis
class AnalyzeRequest(BaseModel):
    url: str = None
    text: str = None

# Helper function to call OpenRouter API asynchronously using the specified model
async def analyze_text_with_openrouter(text: str) -> str:
    messages = [
        {
            "role": "system",
            "content": (
                "You are a bias detection and fact-checking assistant. "
                "Analyze the provided text, identify any bias, factual errors, or other inaccuracies. "
                "Explain your findings in detail and point out specific errors if present."
            )
        },
        {"role": "user", "content": text}
    ]
    payload = {
        "model": "mistralai/mistral-small-24b-instruct-2501",
        "messages": messages,
        "temperature": 0.7,
    }
    
    logger.info("Preparing to send payload to OpenRouter API")
    
    openrouter_url = os.getenv("OPENROUTER_API_URL", "https://openrouter.ai/api/v1/chat/completions")
    headers = {
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "Content-Type": "application/json",
        "HTTP-Referer": backend_origin,  # Add referer header which may be required
        "X-Title": "Bias Analyzer",      # Add title header for tracking
    }
    
    # Add retry logic
    max_retries = 3
    retry_count = 0
    
    while retry_count < max_retries:
        try:
            logger.info(f"Sending request to OpenRouter API (attempt {retry_count + 1})")
            async with session.post(openrouter_url, json=payload, headers=headers) as response:
                if response.status != 200:
                    error_detail = await response.text()
                    logger.error(f"OpenRouter API error: Status {response.status}, Details: {error_detail}")
                    
                    # Check if we should retry based on status code
                    if response.status in [429, 500, 502, 503, 504]:
                        retry_count += 1
                        if retry_count < max_retries:
                            wait_time = 2 ** retry_count  # Exponential backoff
                            logger.info(f"Retrying in {wait_time} seconds...")
                            await asyncio.sleep(wait_time)
                            continue
                    
                    raise HTTPException(status_code=response.status, detail=f"Error from OpenRouter API: {error_detail}")
                
                data = await response.json()
                try:
                    analysis_result = data["choices"][0]["message"]["content"].strip()
                    logger.info("Successfully received and parsed OpenRouter API response")
                    return analysis_result
                except (KeyError, IndexError) as e:
                    logger.error(f"Invalid response format from OpenRouter API: {str(e)}")
                    logger.error(f"Response data: {data}")
                    raise HTTPException(status_code=500, detail="Invalid response format from OpenRouter API")
        
        except asyncio.TimeoutError:
            logger.error(f"Request to OpenRouter API timed out (attempt {retry_count + 1})")
            retry_count += 1
            if retry_count < max_retries:
                wait_time = 2 ** retry_count
                logger.info(f"Retrying in {wait_time} seconds...")
                await asyncio.sleep(wait_time)
            else:
                raise HTTPException(status_code=504, detail="Request to OpenRouter API timed out after multiple attempts.")
        
        except aiohttp.ClientError as e:
            logger.error(f"Client error when calling OpenRouter API: {str(e)}")
            retry_count += 1
            if retry_count < max_retries:
                wait_time = 2 ** retry_count
                logger.info(f"Retrying in {wait_time} seconds...")
                await asyncio.sleep(wait_time)
            else:
                raise HTTPException(status_code=500, detail=f"Client error when calling OpenRouter API: {str(e)}")

    # If we get here, all retries failed
    raise HTTPException(status_code=500, detail="Failed to get valid response from OpenRouter API after multiple attempts")

# Modified /analyze endpoint with caching for large responses
@app.post("/analyze")
async def analyze_bias(request: AnalyzeRequest):
    logger.info("Received analysis request.")

    if not request.url and not request.text:
        logger.error("No URL or text provided.")
        raise HTTPException(status_code=400, detail="Please provide either a URL or text to analyze.")

    input_text = request.text

    if request.url and not request.text:
        try:
            logger.info(f"Fetching content from URL: {request.url}")
            # Add timeout specifically for website fetching
            fetch_timeout = aiohttp.ClientTimeout(total=30)
            async with session.get(request.url, timeout=fetch_timeout) as resp:
                if resp.status != 200:
                    logger.error(f"Failed to fetch website content. Status: {resp.status}")
                    raise HTTPException(status_code=400, detail=f"Could not fetch website content. Status code: {resp.status}")
                
                raw_html = await resp.text()
                soup = BeautifulSoup(raw_html, "html.parser")
                for tag in soup(["script", "style"]):
                    tag.decompose()
                input_text = soup.get_text(separator="\n", strip=True)
                logger.info(f"Extracted {len(input_text)} characters of text from webpage.")
        except Exception as e:
            logger.exception("Error fetching or scraping URL:")
            raise HTTPException(status_code=500, detail=f"Error fetching or scraping URL: {str(e)}")

    if not input_text:
        logger.error("No text content available for analysis after fetching.")
        raise HTTPException(status_code=400, detail="No text content available for analysis.")

    try:
        # Limit input text length if too large
        if len(input_text) > 50000:
            logger.warning(f"Input text is very large ({len(input_text)} chars). Truncating to 50000 chars.")
            input_text = input_text[:50000] + "... [text truncated due to length]"
            
        logger.info("Sending text for analysis...")
        analysis_result = await analyze_text_with_openrouter(input_text)
        logger.info(f"Analysis completed successfully. Result length: {len(analysis_result)} chars")

        paragraphs = [p.strip() for p in analysis_result.split('\n\n') if p.strip()]
        if not paragraphs:
            paragraphs = [p.strip() for p in analysis_result.split('\n') if p.strip()]
        
        result_dict = {"analysis": paragraphs}
        
        # Return a standard JSONResponse with appropriate headers for browser caching
        response = JSONResponse(
            content=result_dict,
            headers={
                "Cache-Control": "no-cache",  # Prevent caching of this response
                "X-Content-Type-Options": "nosniff"  # Prevent MIME type sniffing
            }
        )
        
        logger.info("Successfully returning analysis response")
        return response
    except Exception as e:
        logger.exception("Exception during analysis process:")
        # Return a properly formatted error response
        return JSONResponse(
            status_code=500,
            content={"detail": f"Error during analysis: {str(e)}"}
        )