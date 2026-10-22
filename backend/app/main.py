from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from .config import settings
from .database import Base, SessionLocal, engine, get_session
from .models import ContactMessage, Project
from .schemas import ContactCreate, ContactOut, ProjectOut

SEED_PROJECTS = [
    {"title": "Історії, які хочеться пам’ятати", "category": "Фотографія", "description": "Живі емоції, природне світло й увага до деталей. Зберігаю атмосферу важливих подій у кадрах, до яких хочеться повертатися.", "image_url": "/assets/wedding.jpg", "accent": "orange", "sort_order": 1},
    {"title": "Відео з характером", "category": "Відеовиробництво", "description": "Композиція, рух камери, світло й монтаж поєднуються у цілісну візуальну розповідь.", "image_url": "/assets/навчання.png", "accent": "blue", "sort_order": 2},
    {"title": "Навчання бачити кадр", "category": "Освіта та креатив", "description": "Розвиваю операторське мислення: від побудови кадру й роботи з фокусом до власних відеоісторій.", "image_url": "/assets/навчання композиції.png", "accent": "mint", "sort_order": 3},
]


@asynccontextmanager
async def lifespan(_: FastAPI):
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    async with SessionLocal() as session:
        existing = await session.scalar(select(Project.id).limit(1))
        if existing is None:
            session.add_all(Project(**project) for project in SEED_PROJECTS)
            await session.commit()
    yield
    await engine.dispose()


app = FastAPI(title="Portfolio API", version="1.0.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in settings.frontend_origins.split(",")],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/api/health")
async def health():
    return {"status": "ok"}


@app.get("/api/projects", response_model=list[ProjectOut])
async def list_projects(session: AsyncSession = Depends(get_session)):
    result = await session.scalars(select(Project).order_by(Project.sort_order, Project.id))
    return result.all()


@app.post("/api/contact", response_model=ContactOut, status_code=status.HTTP_201_CREATED)
async def create_contact(payload: ContactCreate, session: AsyncSession = Depends(get_session)):
    message = ContactMessage(**payload.model_dump())
    session.add(message)
    await session.commit()
    await session.refresh(message)
    return message


app.mount("/", StaticFiles(directory="static", html=True, check_dir=False), name="frontend")
