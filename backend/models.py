from pydantic import BaseModel, Field
from typing import Optional
from enum import Enum


class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"


class MemberBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    surname: str = Field(..., min_length=1, max_length=100)
    birth_year: Optional[int] = Field(None, ge=1700, le=2030)
    gender: Gender
    father_id: Optional[int] = None
    mother_id: Optional[int] = None
    notes: Optional[str] = Field(None, max_length=500)


class MemberCreate(MemberBase):
    pass


class MemberUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    surname: Optional[str] = Field(None, min_length=1, max_length=100)
    birth_year: Optional[int] = Field(None, ge=1700, le=2030)
    gender: Optional[Gender] = None
    father_id: Optional[int] = None
    mother_id: Optional[int] = None
    notes: Optional[str] = Field(None, max_length=500)


class Member(MemberBase):
    id: int
