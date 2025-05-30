from sqlalchemy import Column, Integer, String, JSON
from app.database import Base

class UserData(Base):
    __tablename__ = "user_data"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), index=True)
    title = Column(String(255))
    structured_data = Column(String(255))
    semi_structured_data = Column(JSON)
