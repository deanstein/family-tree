# Family Tree

An interactive family tree web app with support for a radial tree view and a timeline view.

## Available now
Try the latest version of the [Family Tree](https://deanstein.github.io/family-tree-deploy/).

## Development

### First time install

```bash
yarn install
```

### Run dev

```bash
yarn run dev
```

### Build production


```bash
yarn run build
```

### Preview production
```bash
yarn run preview
```

### Encrypting Data

```bash
printf 'string to encrypt' | openssl enc -e -base64 -A -aes-256-cbc -pbkdf2 -pass pass:"secretpassword"
``````