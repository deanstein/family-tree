# Family Tree

An interactive family tree web app.

### Encrypting Data

printf 'string to encrypt' | openssl enc -e -base64 -A -aes-256-cbc -pbkdf2 -pass pass:"secretpassword"