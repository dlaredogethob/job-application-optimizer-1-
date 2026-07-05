import os

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from google import genai
from google.genai import types


app = FastAPI(
    title="Job Optimizer API",
    version="1.0.0",
)


# Only these browser origins may call the API through a normal browser request.
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


# Cloud Run provides Google Application Default Credentials automatically
# through the service account assigned to the deployed service.
#
# Do NOT place a Gemini API key in this file.
LOCATION = os.environ.get("GOOGLE_CLOUD_LOCATION", "global")
MODEL_ID = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")


client = genai.Client(
    vertexai=True,
    location=LOCATION,
    http_options=types.HttpOptions(api_version="v1"),
)


@app.get("/")
def health_check():
    return {
        "status": "ok",
        "service": "job-optimizer-api",
    }

class GenerateRequest(BaseModel):
    contents: list[dict]
    system_instruction: dict | None = None

@app.post("/generate")
async def generate(request: GenerateRequest):
    try:
        body = request.model_dump()
        contents = body.get("contents")
        system_instruction = body.get("system_instruction")

        if not isinstance(contents, list) or not contents:
            raise HTTPException(
                status_code=400,
                detail="Request must include contents.",
            )

        first_content = contents[0]

        if not isinstance(first_content, dict):
            raise HTTPException(
                status_code=400,
                detail="Invalid contents format.",
            )

        prompt_parts = first_content.get("parts", [])

        if not isinstance(prompt_parts, list) or not prompt_parts:
            raise HTTPException(
                status_code=400,
                detail="Request must include prompt text.",
            )

        first_part = prompt_parts[0]

        if not isinstance(first_part, dict):
            raise HTTPException(
                status_code=400,
                detail="Invalid prompt format.",
            )

        prompt = first_part.get("text", "")

        if not isinstance(prompt, str) or not prompt.strip():
            raise HTTPException(
                status_code=400,
                detail="Request must include prompt text.",
            )

        # Prevent unexpectedly large requests from consuming excessive resources.
        if len(prompt) > 100_000:
            raise HTTPException(
                status_code=413,
                detail="Prompt is too large.",
            )

        instruction_text = ""

        if isinstance(system_instruction, dict):
            instruction_parts = system_instruction.get("parts", [])

            if isinstance(instruction_parts, list) and instruction_parts:
                first_instruction_part = instruction_parts[0]

                if isinstance(first_instruction_part, dict):
                    possible_instruction = first_instruction_part.get("text", "")

                    if isinstance(possible_instruction, str):
                        instruction_text = possible_instruction

        config = None

        if instruction_text.strip():
            config = types.GenerateContentConfig(
                system_instruction=instruction_text,
            )

        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config=config,
        )

        generated_text = response.text or ""

        return {
            "candidates": [
                {
                    "content": {
                        "parts": [
                            {
                                "text": generated_text,
                            }
                        ]
                    }
                }
            ]
        }

    except HTTPException:
        raise

    except Exception as error:
        print(f"Gemini generation error: {error}")

        raise HTTPException(
            status_code=500,
            detail="The AI request could not be completed.",
        )
