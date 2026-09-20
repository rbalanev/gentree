from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from routes.members import router as members_router
from database import init_db

app = FastAPI(title="Heritage -- Family Tree Portal", version="0.0.1_build_009")

# Root endpoint
@app.get("/")
def root():
    return {"message": "Heritage Family Tree Portal API", "version": "0.0.1_build_009", "docs": "/docs"}

# CORS: allow frontend dev server (port 5173 with Vite)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database on startup
@app.on_event("startup")
def startup_event():
    init_db()

# Include routers
app.include_router(members_router)
