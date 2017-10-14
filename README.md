[![Codacy Badge](https://api.codacy.com/project/badge/Grade/ec60a4042fdd49ce9a1038a500ba92a3)](https://www.codacy.com/app/orangesys/app.orangesys.io?utm_source=github.com&utm_medium=referral&utm_content=orangesys/app.orangesys.io&utm_campaign=badger)
[![dependencies Status](https://david-dm.org/orangesys/app.orangesys.io.svg)](https://david-dm.org/orangesys/app.orangesys.io)
[![CircleCI](https://circleci.com/gh/orangesys/app.orangesys.io.svg?style=svg)](https://circleci.com/gh/orangesys/app.orangesys.io)

# Development

## install nvm & node

```bash
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
```

```bash
nvm install 8.4.0
nvm alias default 8.4.0
```

```bash
npm install yarn -g
export PATH=$(npm bin):$PATH
```

## Config

``` bash
cp .env-sample .env
```

## Change api key with .env

``` bash
# edit .env
NODE_ENV=development
FIREBASE_API_KEY=XXXXXXXXXXXXXXXXXXXXX
FIREBASE_AUTH_DOMAIN=orangesys-21d3f.firebaseapp.com
FIREBASE_DATABASE_URL=https://orangesys-21d3f.firebaseio.com
FIREBASE_STORAGE_BUCKET=orangesys-21d3f.appspot.com
PAYMENT_API_ENDPOINT=https://PAYMENT_API_ENDPOINT
ORANGESYS_API_ENDPOINT=https://ORANGESYS_API_ENDPOINT
SENTRY_DSN=https://XXXXXXXX@sentry.io/YYYYYYY
HOST=0.0.0.0
```

## Install

```bash
yarn
```

## Test

```bash
npm test
```

## Create a Firebase project

For more information, see <https://console.firebase.google.com>

## Login with ci use token

```bash
firebase login:ci
```

## Update database rules

```bash
firebase deploy --project "$FIREBASE_PROJECT" --token "$FIREBASE_TOKEN" --non-interactive --only database
```

## Start in deployment

```bash
npm run dev
```