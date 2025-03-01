from dotenv import load_dotenv
load_dotenv(override=True)  # Load environment variables from .env

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
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

# Configure CORS
backend_origin = os.getenv("BACKEND_ORIGIN", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[backend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global aiohttp session; will be created at startup.
session: aiohttp.ClientSession = None

@app.on_event("startup")
async def startup_event():
    global session
    session = aiohttp.ClientSession()
    logger.info("Backend is up and running on port 8000!")

@app.on_event("shutdown")
async def shutdown_event():
    await session.close()

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
        "model": "mistralai/mistral-small-24b-instruct-2501",  # Using the specified model
        "messages": messages,
        "temperature": 0.7,
    }
    
    # Log the payload exactly as it will be sent
    logger.info("Payload sent to OpenRouter API:\n%s", json.dumps(payload, indent=4))
    
    openrouter_url = os.getenv("OPENROUTER_API_URL", "https://openrouter.ai/api/v1/chat/completions")
    headers = {
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "Content-Type": "application/json",
    }
    logger.info(f"Sending request to OpenRouter API at {openrouter_url} using model mistralai/mistral-small-24b-instruct-2501")
    
    # Set a timeout (e.g., 30 seconds)
    timeout = aiohttp.ClientTimeout(total=30)
    try:
        async with session.post(openrouter_url, json=payload, headers=headers, timeout=timeout) as response:
            if response.status != 200:
                error_detail = await response.text()
                logger.error(f"OpenRouter API error: {error_detail}")
                raise HTTPException(status_code=response.status, detail=f"Error from OpenRouter API: {error_detail}")
            data = await response.json()
            try:
                analysis_result = data["choices"][0]["message"]["content"].strip()
            except (KeyError, IndexError):
                logger.error("Invalid response format from OpenRouter API")
                raise HTTPException(status_code=500, detail="Invalid response format from OpenRouter API")
            return analysis_result
    except asyncio.TimeoutError:
        logger.error("Request to OpenRouter API timed out.")
        raise HTTPException(status_code=504, detail="Request to OpenRouter API timed out.")
    except aiohttp.ClientError as e:
        logger.error(f"Client error when calling OpenRouter API: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Client error when calling OpenRouter API: {str(e)}")

# /analyze endpoint that returns only the formatted analysis
@app.post("/analyze")
async def analyze_bias(request: AnalyzeRequest):
    logger.info("Received analysis request.")

    if not request.url and not request.text:
        logger.error("No URL or text provided.")
        raise HTTPException(status_code=400, detail="Please provide either a URL or text to analyze.")

    input_text = request.text

    # If a URL is provided and text is empty, fetch website content asynchronously and scrape text
    if request.url and not request.text:
        try:
            logger.info(f"Fetching content from URL: {request.url}")
            async with session.get(request.url) as resp:
                if resp.status != 200:
                    logger.error("Failed to fetch website content. Status: " + str(resp.status))
                    raise HTTPException(status_code=400, detail="Could not fetch website content.")
                raw_html = await resp.text()
                # Use BeautifulSoup to parse HTML and extract text
                soup = BeautifulSoup(raw_html, "html.parser")
                for tag in soup(["script", "style"]):
                    tag.decompose()
                input_text = soup.get_text(separator="\n", strip=True)
                logger.info("Extracted text from webpage.")
        except Exception as e:
            logger.exception("Error fetching or scraping URL:")
            raise HTTPException(status_code=500, detail=f"Error fetching or scraping URL: {str(e)}")

    if not input_text:
        logger.error("No text content available for analysis after fetching.")
        raise HTTPException(status_code=400, detail="No text content available for analysis.")

    try:
        analysis_result = await analyze_text_with_openrouter(input_text)
        logger.info("Analysis completed successfully.")

        # Format the analysis by splitting it into paragraphs (using double-newlines, fallback to single newlines)
        paragraphs = [p.strip() for p in analysis_result.split('\n\n') if p.strip()]
        if not paragraphs:
            paragraphs = [p.strip() for p in analysis_result.split('\n') if p.strip()]
        result_dict = {"analysis": paragraphs}
        logger.info("Returning response: %s", json.dumps(result_dict, indent=4))
        # Return the result_dict directly, letting FastAPI handle JSON conversion
        return result_dict
    except Exception as e:
        logger.exception("Exception while calling OpenRouter API:")
        raise HTTPException(status_code=500, detail=f"OpenRouter API error: {str(e)}")