# Archivo de configuración de base de datos
# Para futuras mejoras: integrar SQLite/PostgreSQL
# Actualmente, los datos se almacenan en memoria

SQLALCHEMY_DATABASE_URL = "sqlite:///./ecommerce.db"

# Configuración de conexión
# from sqlalchemy import create_engine
# from sqlalchemy.orm import sessionmaker
# 
# engine = create_engine(
#     SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
# )
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
