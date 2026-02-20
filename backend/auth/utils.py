from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

password_hasher = PasswordHasher(
    time_cost=3,
    memory_cost=64 * 1024,
    parallelism=4,
)


def hash_password(password: str) -> str:
    return password_hasher.hash(password)


def verify_password(hash: str, password: str) -> bool:
    try:
        return password_hasher.verify(hash, password)
    except VerifyMismatchError:
        return False
