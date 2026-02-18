from argon2 import PasswordHasher

password_hasher = PasswordHasher(
    time_cost=3,
    memory_cost=64 * 1024,
    parallelism=4,
)


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(hash: str, password: str) -> bool:
    return password_hasher.verify(hash, password)
