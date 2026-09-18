import os
from openpyxl import Workbook, load_workbook
from typing import List, Optional

from config import DATA_DIR, XLSX_PATH
from models import Member, MemberCreate, MemberUpdate


def init_db() -> None:
    """Create the data directory and xlsx file if they don't exist."""
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(XLSX_PATH):
        wb = Workbook()
        ws = wb.active
        ws.title = "People"
        ws.append(["id", "name", "surname", "birth_year", "gender", "father_id", "mother_id", "notes"])
        wb.save(XLSX_PATH)


def _load_workbook() -> Workbook:
    """Open the xlsx file in read-write mode."""
    return load_workbook(XLSX_PATH)


def _save_workbook(wb: Workbook) -> None:
    """Save the workbook to disk."""
    wb.save(XLSX_PATH)


def _row_to_member(row: list) -> Optional[Member]:
    """Convert an openpyxl row to a Member dict."""
    try:
        row_id = int(row[0])
        birth_year = int(row[3]) if row[3] else None
        gender = row[4]
        father_id = int(row[5]) if row[5] else None
        mother_id = int(row[6]) if row[6] else None
        notes = row[7] if row[7] else None
        return Member(
            id=row_id,
            name=str(row[1]),
            surname=str(row[2]),
            birth_year=birth_year,
            gender=gender,
            father_id=father_id,
            mother_id=mother_id,
            notes=notes,
        )
    except (ValueError, IndexError):
        return None


def get_all_members() -> List[Member]:
    """Read all rows, returns list of Members."""
    wb = _load_workbook()
    ws = wb.active
    members = []
    for row in ws.iter_rows(min_row=2, values_only=True):
        member = _row_to_member(list(row))
        if member:
            members.append(member)
    wb.close()
    return members


def get_member_by_id(member_id: int) -> Optional[Member]:
    """Returns a single Member or None."""
    wb = _load_workbook()
    ws = wb.active
    for row in ws.iter_rows(min_row=2, values_only=True):
        member = _row_to_member(list(row))
        if member and member.id == member_id:
            wb.close()
            return member
    wb.close()
    return None


def create_member(data: MemberCreate) -> Member:
    """Appends a new row, increments id, returns the created Member."""
    wb = _load_workbook()
    ws = wb.active

    # Calculate next ID
    max_id = 0
    for row in ws.iter_rows(min_row=2, values_only=True):
        if row[0]:
            max_id = max(max_id, int(row[0]))
    new_id = max_id + 1

    ws.append([
        new_id,
        data.name,
        data.surname,
        data.birth_year,
        data.gender.value,
        data.father_id,
        data.mother_id,
        data.notes,
    ])
    _save_workbook(wb)
    wb.close()

    return Member(
        id=new_id,
        name=data.name,
        surname=data.surname,
        birth_year=data.birth_year,
        gender=data.gender,
        father_id=data.father_id,
        mother_id=data.mother_id,
        notes=data.notes,
    )


def update_member(member_id: int, data: MemberUpdate) -> Optional[Member]:
    """Finds the row by id, updates fields, returns updated Member or None."""
    wb = _load_workbook()
    ws = wb.active

    for row_idx, row in enumerate(ws.iter_rows(min_row=2, values_only=True), start=2):
        member = _row_to_member(list(row))
        if member and member.id == member_id:
            ws.cell(row=row_idx, column=2, value=data.name if data.name is not None else member.name)
            ws.cell(row=row_idx, column=3, value=data.surname if data.surname is not None else member.surname)
            ws.cell(row=row_idx, column=4, value=data.birth_year if data.birth_year is not None else member.birth_year)
            ws.cell(row=row_idx, column=5, value=data.gender.value if data.gender is not None else member.gender.value)
            ws.cell(row=row_idx, column=6, value=data.father_id)
            ws.cell(row=row_idx, column=7, value=data.mother_id)
            ws.cell(row=row_idx, column=8, value=data.notes)
            _save_workbook(wb)
            wb.close()

            updated = Member(
                id=member_id,
                name=data.name if data.name is not None else member.name,
                surname=data.surname if data.surname is not None else member.surname,
                birth_year=data.birth_year if data.birth_year is not None else member.birth_year,
                gender=data.gender if data.gender is not None else member.gender,
                father_id=data.father_id,
                mother_id=data.mother_id,
                notes=data.notes,
            )
            return updated
    wb.close()
    return None


def delete_member(member_id: int) -> bool:
    """Removes the row by id. Also clears father_id and mother_id references in other rows."""
    wb = _load_workbook()
    ws = wb.active

    # First, clear references to this member in other rows
    for row in ws.iter_rows(min_row=2, values_only=True):
        row_data = list(row)
        needs_update = False
        if row_data[5] == member_id:  # father_id
            ws.cell(row=row[0], column=6, value=None)
            needs_update = True
        if row_data[6] == member_id:  # mother_id
            ws.cell(row=row[0], column=7, value=None)
            needs_update = True
        if needs_update:
            pass  # Will save at the end

    # Now delete the row
    deleted = False
    rows_to_delete = []
    for row_idx, row in enumerate(ws.iter_rows(min_row=2, values_only=True), start=2):
        member = _row_to_member(list(row))
        if member and member.id == member_id:
            ws.delete_rows(row_idx)
            deleted = True
            break

    if deleted:
        _save_workbook(wb)
    wb.close()
    return deleted
