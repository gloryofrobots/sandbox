DEBUG = True

PORT = 8881

MONGODB_HOST = 'mongodb://localhost:27017'

LOG_FILE = "log/auth.log"

# allowed cross origin request domains
CORS_DOMAINS = "*"

JWT_SECRET = 'TOPSECRET'
JWT_ALGO = 'HS256'
# jwt lifetime in seconds
JWT_DURATION = 20
