import logging
from passlib.hash import pbkdf2_sha256 as hasher
import uuid
import jwt
from datetime import datetime, timedelta
import time

epoch = datetime.utcfromtimestamp(0)


class SessionExpiredError(Exception):
    pass

class UnauthorizedAccessError(Exception):
    pass

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


def utc_now():
    return int(round(time.time() * 1000))