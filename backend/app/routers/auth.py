from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.auth_user import AuthUser
from app.schemas.auth_user import UserCreate, UserLogin, UserOut
from app.utils.auth import hash_password, verify_password

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/signup", response_model=UserOut)
def signup(user: UserCreate, db: Session = Depends(get_db)):
    existing_email = db.query(AuthUser).filter(AuthUser.email == user.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email already registered")
    existing_username = db.query(AuthUser).filter(AuthUser.username == user.username).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Username already taken")

    new_user = AuthUser(
        username=user.username,
        email=user.email,
        password_hash=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(AuthUser).filter(AuthUser.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {"message": f"Welcome back, {db_user.username}!"}
