import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "backend", "data")
XLSX_PATH = os.path.join(DATA_DIR, "family_tree.xlsx")
PORT = 8000
