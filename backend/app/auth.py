from fastapi import Request, HTTPException, Depends
from jose import jwt
import requests
import os
from dotenv import load_dotenv

load_dotenv()  # <-- Add this line
CLERK_JWT_PUBLIC_KEY = os.getenv("CLERK_JWT_PUBLIC_KEY")

def get_current_user(request: Request):
    token = request.headers.get("Authorization")
    if not token:
        raise HTTPException(status_code=401, detail="Missing token")

    token = token.split(" ")[1]
    try:
        payload = jwt.decode(token, CLERK_JWT_PUBLIC_KEY, algorithms=["RS256"])

        return payload["sub"]  # Clerk user ID
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")
