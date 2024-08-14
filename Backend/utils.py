import bcrypt

def hash_password(password: str) -> str:
    """
    Hashes a password using bcrypt.
    
    :param password: The plain text password to hash.
    :return: The hashed password.
    """
    # Generate a salt
    salt = bcrypt.gensalt()
    # Hash the password
    hashed_password = bcrypt.hashpw(password.encode(), salt)
    return hashed_password.decode()

def check_password(password: str, hashed_password: str) -> bool:
    """
    Checks if a plain text password matches a hashed password.
    
    :param password: The plain text password to check.
    :param hashed_password: The hashed password to compare against.
    :return: True if the password matches, False otherwise.
    """
    return bcrypt.checkpw(password.encode(), hashed_password.encode())