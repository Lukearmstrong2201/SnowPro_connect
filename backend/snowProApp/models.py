# Models is a way for sqlalchemy to understand what kinds of database tables we are going to be creating within our database in the future

# This will be the record of what is actually inside the database table

from database import Base
from sqlalchemy import Column, Integer, String, Date

class Users(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    contact= Column(String)
    date_of_birth = Column(Date)
    role = Column(String)



