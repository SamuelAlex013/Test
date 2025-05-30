from sqlalchemy.orm import Session
from app import models
from typing import List, Optional

# Create new user data
def create_user_data(db: Session, user_id: str, title: str, structured_data: str, semi_structured_data: dict):
    new_data = models.UserData(
        user_id=user_id,
        title=title,
        structured_data=structured_data,
        semi_structured_data=semi_structured_data
    )
    db.add(new_data)
    db.commit()
    db.refresh(new_data)
    return new_data

# Get all user data
def get_all_user_data(db: Session, user_id: str) -> List[models.UserData]:
    return db.query(models.UserData).filter(models.UserData.user_id == user_id).all()

# Get specific data entry by ID
def get_user_data_by_id(db: Session, user_id: str, data_id: int) -> Optional[models.UserData]:
    return db.query(models.UserData).filter(
        models.UserData.user_id == user_id,
        models.UserData.id == data_id
    ).first()

# Update existing data
def update_user_data(db: Session, user_id: str, data_id: int, title: str, structured_data: str, semi_structured_data: dict):
    data_entry = get_user_data_by_id(db, user_id, data_id)
    if data_entry:
        data_entry.title = title
        data_entry.structured_data = structured_data
        data_entry.semi_structured_data = semi_structured_data
        db.commit()
        db.refresh(data_entry)
    return data_entry

# Delete user data
def delete_user_data(db: Session, user_id: str, data_id: int):
    data_entry = get_user_data_by_id(db, user_id, data_id)
    if data_entry:
        db.delete(data_entry)
        db.commit()
        return True
    return False
