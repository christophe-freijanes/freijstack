#!/bin/bash

# Script to generate .htpasswd from plaintext password
# Usage: ./generate-htpasswd.sh "password"

if [ -z "$1" ]; then
    echo "❌ Usage: ./generate-htpasswd.sh <password>"
    exit 1
fi

PASSWORD="$1"

# Generate bcrypt hash using openssl or htpasswd
if command -v htpasswd &> /dev/null; then
    # Use Apache htpasswd if available
    echo -n "$PASSWORD" | htpasswd -i -B -c .htpasswd admin
elif command -v openssl &> /dev/null; then
    # Use openssl apr1 hashing
    HASH=$(echo -n "$PASSWORD" | openssl passwd -apr1 -stdin)
    echo "admin:$HASH" > .htpasswd
else
    echo "❌ Neither htpasswd nor openssl found"
    exit 1
fi

echo "✅ .htpasswd generated successfully"
echo "File: $(pwd)/.htpasswd"
