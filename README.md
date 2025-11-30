## ❄️ SnowPro Connect — Project Overview

**SnowPro Connect** is a full-stack ski-instructor booking platform designed to connect instructors with clients in real time. The platform provides secure user authentication, instructor profile management, scheduling tools, realtime Ski Resort API and an intuitive booking workflow and Admin managment

## Tech Stack

### **Frontend**

- **React (Vite)** — modern, fast, component-based UI
- **JavaScript / JSX** — component-based frontend logic
- **CSS** — Standard CSS first styling
- **React Router** — client-side navigation

### **Backend**

- **FastAPI (Python)** — high-performance REST API
- **Pydantic** — data validation and schema modeling
- **JWT Authentication** — secure login, protected routes
- **bcrypt** — password hashing

### **Database**

- **SQLAlchemy / ORM models** — structured ORM-style relationships

## Key Features

- Instructor dashboard with editable availability form
- Client booking system with profile and preferences
- Secure authentication with JWT
- Role-based access
- Admin Platform for management
- Fast, scalable API architecture
- Clean, responsive UI optimized for desktop and mobile

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## SnowPro Connect - Project Setup Guide

This guide will help you set up and run both the frontend (React/Vite) and backend (FastAPI) for the SnowPro Connect project.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## Cloning the Repository

First, clone the repository to your local machine:

## Using HTTPS

git clone https://github.com/yourusername/snowpro_connect.git

## Or using SSH

`git clone git@github.com:yourusername/snowpro_connect.git`

Move into the project directory:

`cd snowpro_connect`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ➡ Running the Frontend (React/Vite)

The frontend is built using Vite and requires Node.js and npm.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ Install Dependencies

## Navigate to the frontend directory and install dependencies:

`npm install`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2️⃣ Start the Development Server

`npm run dev`

▶ After running the above command, the terminal will display a local development URL (e.g., http://localhost:5173). Open this URL in your browser to access the frontend.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## ⬅ Running the Backend (FastAPI)

The backend is built using FastAPI and requires Python 3.10+ and virtual environments.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1️⃣ Navigate to Backend Directory

`cd backend`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

2️⃣ Activate Virtual Environment

Depending on your terminal, activate the virtual environment:

🖥 Windows (PowerShell)

`fastapienv/Scripts/Activate.ps1`

🖥 Windows (Command Prompt - cmd)

`fastapienv\Scripts\activate`

🖥 Mac/Linux (Bash/Zsh)

`source fastapienv/bin/activate`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

3️⃣ Navigate to the snowProApp Directory

`cd snowProApp`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

4️⃣ Install Backend Dependencies

📦 Ensure all required Python packages are installed:

`pip install -r requirements.txt`

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

5️⃣ Start the FastAPI Server

`uvicorn main:app --reload`

▶ This will start the FastAPI server at http://127.0.0.1:8000.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

## 🌍 Access API Documentation:

Swagger UI: http://127.0.0.1:8000/docs

📖 docs: http://127.0.0.1:8000/docs
