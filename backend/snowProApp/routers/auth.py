from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from models import Users, Students, Instructors, CertificationBodyEnum, QualificationLevelEnum
from passlib.context import CryptContext
from database import SessionLocal
from sqlalchemy.orm import Session
from typing import Annotated, Literal
from starlette import status
from datetime import date, timedelta, datetime, timezone
from fastapi.security import OAuth2PasswordRequestForm, OAuth2PasswordBearer
from jose import jwt, JWTError

router = APIRouter(prefix="/auth", tags=["Authentication"])

SECRET_KEY = "df458d5c559d12ca06ddfd80540cf6b23599ad42e8a1f5fedf1202cbd25491fb"
ALGORITHM = "HS256"

bcrypt_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="/auth/token")


# -----------------------------
# MODELS
# -----------------------------

class CreateUserRequest(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    role: Literal["student", "instructor"]
    contact: str
    date_of_birth: date
    address: str
    language: str
    certificate_body: CertificationBodyEnum | None = None
    level_of_qualification: QualificationLevelEnum | None = None
    years_of_experience: int | None = None


class Token(BaseModel):
    access_token: str
    token_type: str


# -----------------------------
# DB DEPENDENCY
# -----------------------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


db_dependency = Annotated[Session, Depends(get_db)]


# -----------------------------
# AUTH HELPERS
# -----------------------------

def authenticate_user(email: EmailStr, password: str, db):
    user = db.query(Users).filter(Users.email == email).first()
    if not user:
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user


def create_access_token(email: EmailStr, user_id: int, expires_delta: timedelta):
    encode = {"sub": email, "id": user_id}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({"exp": expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(token: str = Depends(oauth2_bearer), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("id")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication token")

        user = db.query(Users).filter(Users.id == user_id).first()
        if user is None or not user.is_active:
            raise HTTPException(status_code=401, detail="User not found or inactive")

        return user

    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate token")


# -----------------------------
# ROUTES
# -----------------------------

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: CreateUserRequest):

    try:
        # ------------------------------
        # Password safety
        # ------------------------------
        pw_bytes = create_user_request.password.encode("utf-8")
        if len(pw_bytes) > 72:
            raise HTTPException(
                status_code=400,
                detail="Password must be 72 characters or fewer."
            )
        
        # ------------------------------
        # Check if email exists
        # ------------------------------

        existing_user = db.query(Users).filter(Users.email == create_user_request.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # ------------------------------
        # First registered user becomes ADMIN
        # All others cannot pick admin role
        # ------------------------------

        is_first_user = db.query(Users).count() == 0

        if is_first_user:
            assigned_role = "admin"
        else:
            # force student/instructor only
            assigned_role = create_user_request.role

        hashed_password = bcrypt_context.hash(create_user_request.password)

        # ------------------------------
        # Create base user
        # ------------------------------

        user = Users(
            first_name=create_user_request.first_name,
            last_name=create_user_request.last_name,
            email=create_user_request.email,
            hashed_password=hashed_password,
            role= assigned_role,
            contact=create_user_request.contact,
            address=create_user_request.address,
            date_of_birth=create_user_request.date_of_birth,
            language=create_user_request.language,
            is_active=True,
        )

        db.add(user)
        db.commit()
        db.refresh(user)

        # ------------------------------
        # If admin → DO NOT create student/instructor profile
        # ------------------------------
        if assigned_role == "student":
            student = Students(user_id=user.id)
            db.add(student)

        elif assigned_role == "instructor":
            if not (
                create_user_request.certificate_body
                and create_user_request.level_of_qualification
                and create_user_request.years_of_experience
            ):
                raise HTTPException(status_code=400, detail="All instructor fields are required")

            instructor = Instructors(
                user_id=user.id,
                certificate_body=create_user_request.certificate_body,
                level_of_qualification=create_user_request.level_of_qualification,
                years_of_experience=create_user_request.years_of_experience,
            )
            db.add(instructor)

        db.commit()

        return {"message": "User created successfully", "user_id": user.id,"role": assigned_role,
            "first_user_admin": is_first_user}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


@router.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: db_dependency,
):

    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(user.email, user.id, timedelta(minutes=20))

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": user.role,
            "is_active": user.is_active,
            "profile_picture": user.profile_picture,
        },
    }
