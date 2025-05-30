from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import user_data
from app.database import Base, engine
from app.models import UserData

Base.metadata.create_all(bind=engine)


app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or specify your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_data.router)


# uvicorn app.main:app --reload