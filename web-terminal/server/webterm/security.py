import logging
import uuid
import jwt
import time
from passlib.hash import pbkdf2_sha256 as hasher
from datetime import datetime, timedelta

epoch = datetime.utcfromtimestamp(0)


class SessionExpiredError(Exception):
    pass


class UnauthorizedAccessError(Exception):
    pass


def utc_now():
    return int(round(time.time() * 1000))


# must be used only on actions
def authenticated_action(fn):
    def wrapper(self, request):
        self.auth.authenticate(request)
        return fn(self, request)
    return wrapper


def unix_time_millis(dt):
    return (dt - epoch).total_seconds() * 1000.0


def verify_password(password, hashed):
    return hasher.verify(password, hashed)


def hash_password(password):
    hash1 = hasher.hash(password)
    return hash1


def generate_uuid():
    return uuid.uuid4().hex


def create_token(payload, secret, algo, duration):
    exp = datetime.utcnow() + timedelta(seconds=duration)
    payload["exp"] = exp
    token = jwt.encode(payload, secret, algorithm=algo)
    return token, unix_time_millis(exp)


def decode_payload(token, secret, algo):
    try:
        return jwt.decode(token, secret, algorithm=algo)
    except jwt.ExpiredSignatureError as e:
        raise SessionExpiredError(e.message)
    except Exception as e:
        raise UnauthorizedAccessError(e.args)


class Auth(object):
    def __init__(self, secret, algo, duration):
        super(Auth, self).__init__()
        self.secret = secret
        self.algo = algo
        self.duration = duration
        
    def create_token(self, payload):
        return create_token(payload, self.secret, self.algo, self.duration)

    def authenticate(self, request):
        payload = decode_payload(
            request.token,
            self.secret,
            self.algo
        )

        request.authenticate(payload)