load_dotenv()

DB_URL = os.getenv("DB_URL")

print("DB_URL:", DB_URL)  # 👈 AGREGA ESTO

if not DB_URL:
    raise ValueError("DB_URL no está definida")