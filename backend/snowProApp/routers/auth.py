from fastapi import APIRouter, Depends, HTTPException, Form
from pydantic import BaseModel, EmailStr
from models import Users, Students, Instructors, CertificationBodyEnum, QualificationLevelEnum
from passlib.context import CryptContext
from database import SessionLocal
from sqlalchemy.orm import Session
from typing import Annotated, Literal
from starlette import status
from datetime import date, timedelta, datetime, timezone
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt


router = APIRouter(prefix="/auth", tags=["Authentication"])

SECRET_KEY = 'df458d5c559d12ca06ddfd80540cf6b23599ad42e8a1f5fedf1202cbd25491fb'
ALGORITHM = 'HS256'

bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')

class CreateUserRequest(BaseModel):
   
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    role: Literal["student", "instructor"]
    contact: str
    date_of_birth: date #(Must be a string in YYYY-MM-DD format)
    address: str
    language: str
    certificate_body: CertificationBodyEnum = None
    level_of_qualification: QualificationLevelEnum = None
    years_of_experience: int = None
    languages: str = None

class Token(BaseModel): 
    access_token: str
    token_type: str

def get_db():
    db = SessionLocal()     
    try: 
        yield db   
    finally:
        db.close()  


db_dependency = Annotated[Session, Depends(get_db)] 
    

def authenticate_user(email: EmailStr, password: str, db):
    user = db.query(Users).filter(Users.email == email).first()
    if not user: 
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user

def create_access_token(email: EmailStr, user_id: int, expires_delta: timedelta):

    encode = {'sub': email, 'id': user_id}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm = ALGORITHM)


@router.post("/register", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: CreateUserRequest):
    existing_user = db.query(Users).filter(Users.email == create_user_request.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = bcrypt_context.hash(create_user_request.password)
    
    user = Users(
        first_name = create_user_request.first_name,
        last_name = create_user_request.last_name,
        email = create_user_request.email,
        hashed_password = hashed_password,
        role = create_user_request.role,
        contact = create_user_request.contact,
        address = create_user_request.address,
        date_of_birth = create_user_request.date_of_birth,
        language = create_user_request.language,
        is_active = True
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    if create_user_request.role == "student":
        student = Students(user_id = user.id)
        db.add(student)

    elif create_user_request.role == "instructor":
        if not (create_user_request.certificate_body and create_user_request.level_of_qualification and create_user_request.years_of_experience):
            raise HTTPException(status_code=400, detail="All instructor fields are required")
        
        instructor = Instructors(
            user_id = user.id,
            certificate_body=create_user_request.certificate_body,
            level_of_qualification=create_user_request.level_of_qualification,
            years_of_experience=create_user_request.years_of_experience,
            languages=create_user_request.languages
        )
        db.add(instructor)

    db.commit()
    
    return {"message": "User created successfully", "user_id": user.id}

@router.post("/token", response_model=Token)
async def login_for_access_token(form_data: Annotated[OAuth2PasswordRequestForm, Depends()], db:db_dependency):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        return 'Failed Authentication'
    token = create_access_token(user.email, user.id, timedelta(minutes=20))
    return {'access_token': token, 'token_type': 'bearer'}


