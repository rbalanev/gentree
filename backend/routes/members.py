from fastapi import APIRouter, HTTPException
from typing import List

from models import Member, MemberCreate, MemberUpdate
from database import (
    get_all_members,
    get_member_by_id,
    create_member,
    update_member,
    delete_member,
)

router = APIRouter(prefix="/api/members", tags=["members"])


@router.get("/", response_model=List[Member])
def list_members():
    """Get all family members."""
    return get_all_members()


@router.get("/{member_id}", response_model=Member)
def get_member(member_id: int):
    """Get a specific family member by ID."""
    member = get_member_by_id(member_id)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return member


@router.post("/", response_model=Member, status_code=201)
def add_member(data: MemberCreate):
    """Create a new family member."""
    return create_member(data)


@router.put("/{member_id}", response_model=Member)
def edit_member(member_id: int, data: MemberUpdate):
    """Update an existing family member."""
    member = update_member(member_id, data)
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    return member


@router.delete("/{member_id}", status_code=204)
def remove_member(member_id: int):
    """Delete a family member."""
    if not delete_member(member_id):
        raise HTTPException(status_code=404, detail="Member not found")
