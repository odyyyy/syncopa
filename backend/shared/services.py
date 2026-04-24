from pathlib import Path

import aiofiles


async def save_file(file, file_path: Path, chunk_size: int = 1024 * 1024):
    file_path.parent.mkdir(parents=True, exist_ok=True)

    async with aiofiles.open(file_path, "wb") as f:
        while chunk := await file.read(chunk_size):
            await f.write(chunk)
