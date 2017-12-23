import logging
from passlib.hash import pbkdf2_sha512 as hasher

def verify_password(password, hashed):
    return hasher.verify(password, hashed)

def hash_password(password):
    hash1 = hasher.hash(password)
    hash2 = hasher.hash(password)
    logging.info(hash1)
    logging.info(hash2)
    logging.info("Verified %s %s" % (str(hasher.verify(password, hash1)),
                                        str(hasher.verify(password, hash2))))
    return hash1