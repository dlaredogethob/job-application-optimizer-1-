import os

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://dlaredogethob.github.io",
        "http://localhost:5173",
    ],
    allow_credentials=False,
    allow_methods=["POST", "OPTIONS"],
    allow_headers=["Content-Type"],
)

PROJECT_ID = os.environ.get(
    "GOOGLE_CLOUD_PROJECT",
    "gen-lang-client-0857864572",
)

LOCATION = os.environ.get(
    "GOOGLE_CLOUD_LOCATION",
    "us-west1",
)

MODEL_ID = os.environ.get(
    "GEMINI_MODEL",
    "gemini-2.5-flash",
)

client = genai.Client(
    vertexai=True,
    project=PROJECT_ID,
    location=LOCATION,
    http_options=types.HttpOptions(api_version="v1"),
)


@app.get("/")
def health_check():
    return {"status": "ok"}


@app.post("/generate")
async def generate(request: Request):
    try:
        body = await request.json()

        contents = body.get("contents")
        system_instruction = body.get("system_instruction")

        if not isinstance(contents, list) or not contents:
            raise HTTPException(
                status_code=400,
                detail="Request must include contents.",
            )

        prompt_parts = contents[0].get("parts", [])
        if not prompt_parts:
            raise HTTPException(
                status_code=400,
                detail="Request must include prompt text.",
            )

        prompt = prompt_parts[0].get("text", "")
        if not isinstance(prompt, str) or not prompt.strip():
            raise HTTPException(
                status_code=400,
                detail="Request must include prompt text.",
            )

        config = None

        if system_instruction:
            instruction_parts = system_instruction.get("parts", [])
            if instruction_parts:
                instruction = instruction_parts[0].get("text", "")

                if instruction:
                    config = types.GenerateContentConfig(
                        system_instruction=instruction
                    )

        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config=config,
        )

        text = response.text or ""

        return {
            "candidates": [
                {
                    "content": {
                        "parts": [
                            {
                                "text": text
                            }
                        ]
                    }
                }
            ]
        }

    except HTTPException:
        raise

    except Exception:
        raise HTTPException(
            status_code=500,
            detail="The AI request could not be completed.",
        )
