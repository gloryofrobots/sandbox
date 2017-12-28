DEBUG = True

PORT = 8882

LOG_FILE = "log/server.log"

# allowed cross origin request domains
CORS_DOMAINS = "*"

JWT_SECRET = 'TOPSECRET'
JWT_ALGO = 'HS256'
# jwt lifetime in seconds
JWT_DURATION = 2000000
