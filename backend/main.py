from dotenv import load_dotenv
load_dotenv(override=True)  # Load environment variables from .env

from fastapi import FastAPI, HTTPException
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

# Configure CORS
backend_origin = os.getenv("BACKEND_ORIGIN", "http://localhost:5173")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

# Helper function to fetch latest info using DuckDuckGo Instant Answer API
async def fetch_latest_info(query: str) -> str:
    search_url = "https://api.duckduckgo.com/"
    params = {
        "q": query,
        "format": "json",
        "no_html": 1,
        "skip_disambig": 1
    }
    try:
        async with session.get(search_url, params=params) as response:
            if response.status != 200:
                logger.error("DuckDuckGo API error, status: %s", response.status)
                return "No updated info available due to search API error."
            data = await response.json()
            # Use the "AbstractText" as the search result snippet.
            snippet = data.get("AbstractText", "")
            if snippet:
                logger.info("DuckDuckGo snippet: %s", snippet)
                return snippet
            else:
                logger.info("DuckDuckGo returned no snippet.")
                return "No updated info available."
    except Exception as e:
        logger.exception("Error during DuckDuckGo search: %s", str(e))
        return "No updated info available due to an exception."

# Helper function to call OpenRouter API asynchronously using the specified model
async def analyze_text_with_openrouter(text: str) -> str:
    # Fetch recent info for fact-checking.
    latest_info = await fetch_latest_info("current United States Vice President")
    
    # Update the system prompt to instruct the AI to actively "search" and use the fetched info for fact-checking.
    messages = [
        {
            "role": "system",
            "content": (
                "You are an advanced fact-checking assistant. Before answering, you MUST perform a simulated search for the latest verified data. "
                "Use the following fetched search result as your reference: \"" + latest_info + "\". "
                "Then, analyze the provided text, identify any biases, and fact-check all claims against the latest verified information. "
                "Include references to your sources if applicable. "
                "If the fetched information contradicts the claims in the text, explicitly note the discrepancies."
            )
        },
        {"role": "user", "content": text}
    ]
    payload = {
        "model": "mistralai/mistral-small-24b-instruct-2501",
        "messages": messages,
        "temperature": 0.7,
    }
    
    logger.info("Payload sent to OpenRouter API:\n%s", json.dumps(payload, indent=4))
    
    openrouter_url = os.getenv("OPENROUTER_API_URL", "https://openrouter.ai/api/v1/chat/completions")
    headers = {
        "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
        "Content-Type": "application/json",
    }
    logger.info(f"Sending request to OpenRouter API at {openrouter_url} using model mistralai/mistral-small-24b-instruct-2501")
    
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

# /analyze endpoint that returns the formatted analysis using JSONResponse
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
            async with session.get(request.url) as resp:
                if resp.status != 200:
                    logger.error("Failed to fetch website content. Status: " + str(resp.status))
                    raise HTTPException(status_code=400, detail="Could not fetch website content.")
                raw_html = await resp.text()
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

        paragraphs = [p.strip() for p in analysis_result.split('\n\n') if p.strip()]
        if not paragraphs:
            paragraphs = [p.strip() for p in analysis_result.split('\n') if p.strip()]
        result_dict = {"analysis": paragraphs}
        logger.info("Returning response: %s", json.dumps(result_dict, indent=4))
        
        return JSONResponse(content=result_dict)
    except Exception as e:
        logger.exception("Exception while calling OpenRouter API:")
        raise HTTPException(status_code=500, detail=f"OpenRouter API error: {str(e)}")