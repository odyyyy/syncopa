from fastapi.applications import FastAPI


app = FastAPI(title="Syncopa API")

@app.get('/')
def get_test():
    return {'test': 'hello world'}