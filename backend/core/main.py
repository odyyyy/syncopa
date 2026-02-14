from fastapi import FastAPI

app = FastAPI(
    title="Syncopa API",
    debug=True,
    lifespan=None,
)


@app.get("/")
async def root():
    return {"message": "Hello World"}

