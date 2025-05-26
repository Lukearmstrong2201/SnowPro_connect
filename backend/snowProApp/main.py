# Main file is the root folder where i create the fastApi application

from fastapi import FastAPI
import models
from database import engine
from routers import auth, users, students, instructors, admin
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://localhost:5176",
    ], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(students.router)
app.include_router(instructors.router)
app.include_router(admin.router)

# Serve static files (uploaded images)
if not os.path.exists("static/profile_pics"):
    os.makedirs("static/profile_pics")

app.mount("/static", StaticFiles(directory="static"), name="static")


    
