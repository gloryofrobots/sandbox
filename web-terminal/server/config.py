DEBUG = True

PORT = 8882

DB_TYPE = "postgresql"
DB_DSN = "dbname=webterm user=gloryofrobots password=TOP_SECRET host=localhost port=5432"
DB_POOL_SIZE = 1

LOG_FILE = "log/server.log"

# allowed cross origin request domains
CORS_DOMAINS = "*"

JWT_SECRET = "TOP_SECRET"
JWT_ALGO = "HS256"
# jwt lifetime in seconds
JWT_DURATION = 1800
