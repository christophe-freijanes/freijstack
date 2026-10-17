#!/usr/bin/env python3
"""Generate secure htpasswd file for Docker Registry authentication."""

import os
import secrets
import string
import subprocess
import sys


# Generate a secure random password
chars = string.ascii_letters + string.digits + "!@#$%^&*-+=_"
password = "".join(secrets.choice(chars) for _ in range(20))

# Try to use bcrypt
try:
    import bcrypt
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12)).decode()
except ImportError:
    print("Installing bcrypt...")  # noqa: T201
    subprocess.check_call([sys.executable, "-m", "pip", "install", "bcrypt", "-q"])
    import bcrypt
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12)).decode()

username = os.getenv("REGISTRY_USERNAME", "user")

# Write to .htpasswd file
with open(".htpasswd", "w") as f:  # noqa: PTH123
    f.write(f"{username}:{hashed}\n")

print("✅ Password generated and saved to .htpasswd")  # noqa: T201
print(f"Password: {password}")  # noqa: T201
print("")  # noqa: T201
print("📝 Save this password in GitHub Secrets as REGISTRY_PASSWORD")  # noqa: T201
print("")  # noqa: T201
print("📝 Save this password in a secure location!")  # noqa: T201
