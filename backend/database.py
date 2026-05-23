from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
import os

_url = (
    f"postgresql+psycopg2://"
    f"{os.getenv('DB_USER', 'proy3')}:"
    f"{os.getenv('DB_PASSWORD', 'secret')}@"
    f"{os.getenv('DB_HOST', 'db')}/"
    f"{os.getenv('DB_NAME', 'store')}"
)

engine = create_engine(_url, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
