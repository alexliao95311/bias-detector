import requests
from bs4 import BeautifulSoup

def scrape_website(url: str) -> str:
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception(f"Failed to fetch website content. Status: {response.status_code}")
    raw_html = response.text
    # Parse the HTML using BeautifulSoup
    soup = BeautifulSoup(raw_html, "html.parser")
    # Remove script and style elements
    for script_or_style in soup(["script", "style"]):
        script_or_style.decompose()
    # Extract text, separating by newlines and stripping whitespace
    text = soup.get_text(separator="\n", strip=True)
    return text

if __name__ == "__main__":
    url = input("Enter URL to scrape: ")
    try:
        scraped_text = scrape_website(url)
        print("Scraped text:")
        print(scraped_text)
    except Exception as e:
        print("Error scraping website:", str(e))