#!/usr/bin/env python3
import secrets
import string
import subprocess
import sys

# Generate a secure random password
chars = string.ascii_letters + string.digits + '!@#$%^&*-+=_'
password = ''.join(secrets.choice(chars) for i in range(20))

# Try to use bcrypt
try:
    import bcrypt
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12)).decode()
except ImportError:
    print("Installing bcrypt...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "bcrypt", "-q"])
    import bcrypt
    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt(rounds=12)).decode()

# Write to .htpasswd file
with open('.htpasswd', 'w') as f:
    f.write(f'admin:{hashed}\n')

print('✅ Password generated and saved!')
print(f'Username: admin')
print(f'Password: {password}')
print('')
print('📝 Save this password in a secure location!')
