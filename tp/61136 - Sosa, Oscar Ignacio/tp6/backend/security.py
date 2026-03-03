from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Optional

# Configuración de cifrado - Usar pbkdf2_sha256 en lugar de bcrypt para evitar problemas en Windows
pwd_context = CryptContext(schemes=["pbkdf2_sha256", "bcrypt"], deprecated="auto")

# Configuración JWT
SECRET_KEY = "tu-clave-secreta-muy-segura-cambiar-en-produccion"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24  # 30 días


def hash_password(password: str) -> str:
    """Hashea una contraseña con pbkdf2_sha256"""
    return pwd_context.hash(password, scheme="pbkdf2_sha256")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica una contraseña contra su hash"""
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Crea un JWT token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    """Decodifica un JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        return payload
    except JWTError:
        return None
