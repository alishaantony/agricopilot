from fastapi import FastAPI
import time

app = FastAPI(title="AgriCopilot API")
start_time = time.time()

@app.get("/healthz")
def healthz():
    return {"status": "ok"}

@app.get("/metrics")
def metrics():
    uptime = int(time.time() - start_time)
    return {"uptime_seconds": uptime}
