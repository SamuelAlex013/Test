from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.auth import get_current_user
from app.database import get_db
from app import crud

router = APIRouter()

@router.post("/data/")
def create_data(payload: dict, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    return crud.create_user_data(
        db=db,
        user_id=user_id,
        title=payload.get("title"),
        structured_data=payload.get("structured_data"),
        semi_structured_data=payload.get("semi_structured_data")
    )

@router.get("/data/")
def read_all_data(db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    return crud.get_all_user_data(db, user_id)

@router.get("/data/{data_id}")
def read_data_by_id(data_id: int, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    data = crud.get_user_data_by_id(db, user_id, data_id)
    if not data:
        raise HTTPException(status_code=404, detail="Data not found")
    return data

@router.put("/data/{data_id}")
def update_data(data_id: int, payload: dict, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    updated = crud.update_user_data(
        db=db,
        user_id=user_id,
        data_id=data_id,
        title=payload.get("title"),
        structured_data=payload.get("structured_data"),
        semi_structured_data=payload.get("semi_structured_data")
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Data not found")
    return updated

@router.delete("/data/{data_id}")
def delete_data(data_id: int, db: Session = Depends(get_db), user_id: str = Depends(get_current_user)):
    success = crud.delete_user_data(db, user_id, data_id)
    if not success:
        raise HTTPException(status_code=404, detail="Data not found")
    return {"status": "deleted"}
