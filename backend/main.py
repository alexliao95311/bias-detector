from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import requests
from bs4 import BeautifulSoup
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow requests from the frontend during development.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set your OpenRouter API key in your environment or directly here (not recommended for prod)
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
# Replace with the actual OpenRouter API endpoint
OPENROUTER_API_URL = "https://openrouter.ai/api/v1/analyze"

class AnalyzeRequest(BaseModel):
    url: str = None
    text: str = None

@app.post("/analyze")
def analyze(data: AnalyzeRequest):
    # Determine the source text
    content = ""
    if data.url:
        try:
            resp = requests.get(data.url)
            if resp.status_code != 200:
                raise HTTPException(status_code=400, detail="Failed to fetch the provided URL.")
            soup = BeautifulSoup(resp.content, "html.parser")
            content = soup.get_text(separator="\n")
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error fetching URL: {str(e)}")
    elif data.text:
        content = data.text
    else:
        raise HTTPException(status_code=400, detail="Please provide either a URL or text.")

    # Construct the prompt for bias detection and fact checking
    prompt = (
        "Analyze the following text for bias and fact-check its sources. "
        "Provide an assessment of any detected bias and list the sources with your evaluation: \n\n"
        f"{content}"
    )

    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
    }
    payload = {
        "prompt": prompt,
        "model": "gpt-4",  # adjust based on the available models from your API
        "max_tokens": 500,
    }

    try:
        response = requests.post(OPENROUTER_API_URL, headers=headers, json=payload)
        if response.status_code != 200:
            raise HTTPException(status_code=500, detail="Error returned from OpenRouter API.")
        result = response.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calling OpenRouter API: {str(e)}")

    return {"result": result}