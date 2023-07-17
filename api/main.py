from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from api.settings import STATIC_DIR
from api.routers import nets as nets_router, segments as segments_router, stations as stations_router

import uvicorn

title = 'Geo2People'
app = FastAPI(title=title)

app.mount('/static', StaticFiles(directory=STATIC_DIR), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

routers = [nets_router, stations_router, segments_router]

for r in routers:
    app.include_router(r.router)


@app.get("/")
async def health_check():
    return {"msg": f"Welcome to {title}, the server is up and running"}


if __name__ == "__main__":
    uvicorn.run("main:app", log_level="info", reload=True, port=5001)
