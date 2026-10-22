from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class ProjectOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    category: str
    description: str
    image_url: str
    accent: str


class ContactCreate(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    email: EmailStr
    phone: str | None = Field(default=None, max_length=40)
    message: str = Field(min_length=5, max_length=5000)


class ContactOut(BaseModel):
    id: int
    created_at: datetime
