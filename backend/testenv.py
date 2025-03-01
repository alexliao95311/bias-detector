from dotenv import load_dotenv
import os

load_dotenv(override=True)
if __name__ == '__main__':
    print("OPENROUTER_API_KEY:", os.getenv("OPENROUTER_API_KEY"))