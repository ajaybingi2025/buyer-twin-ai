from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.buyers import router as buyers_router
from routes.twins import router as twins_router
from routes.recommendations import router as recommendations_router
from routes.outreach import router as outreach_router
from routes.auth import router as auth_router
from routes.events import router as events_router

app = FastAPI(
    title="BuyerTwin AI Backend",
    description="Backend API for BuyerTwin AI hackathon MVP",
    version="0.1.0",
)

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(buyers_router, prefix="/buyers", tags=["buyers"])
app.include_router(twins_router, prefix="/twins", tags=["twins"])
app.include_router(recommendations_router, prefix="/recommendations", tags=["recommendations"])
app.include_router(outreach_router, prefix="/outreach", tags=["outreach"])
app.include_router(events_router, prefix="/events", tags=["events"])


@app.get("/")
def root():
    return {"message": "BuyerTwin AI backend is running"}