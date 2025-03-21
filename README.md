# Family Tree

An interactive family tree web app with support for a radial tree view and a timeline view.

## Available now
Try the latest version of the [Family Tree](https://deanstein.github.io/family-tree/).

## Development

This app follows the [standard JDG Svelte app build steps](https://github.com/deanstein/jdg-ops#standard-svelte-build-steps).

### Encrypting Data

```bash
printf 'string to encrypt' | openssl enc -e -base64 -A -aes-256-cbc -pbkdf2 -pass pass:"secretpassword"
``````