[![dependencies Status](https://david-dm.org/orangesys/app.orangesys.io.svg)](https://david-dm.org/orangesys/app.orangesys.io)
[![CircleCI](https://circleci.com/gh/orangesys/app.orangesys.io.svg?style=svg)](https://circleci.com/gh/orangesys/app.orangesys.io)

## Run Dev in local
- Docker version > 1.10.0
- wercker CLI

## Installation
http://devcenter.wercker.com/cli/installation/index.html


>```bash
cp .env-sample .env
>```
### change api key with .env
>```bash
# edit .env
NODE_ENV=development
FIREBASE_API_KEY=XXXXXXXXXXXXXXXXXXXXX
FIREBASE_AUTH_DOMAIN=orangesys-21d3f.firebaseapp.com
FIREBASE_DATABASE_URL=https://orangesys-21d3f.firebaseio.com
FIREBASE_STORAGE_BUCKET=orangesys-21d3f.appspot.com
PAYMENT_API_ENDPOINT=https://PAYMENT_API_ENDPOINT
ORANGESYS_API_ENDPOINT=https://ORANGESYS_API_ENDPOINT
HOST=0.0.0.0
```

>```bash
wercker dev --expose-ports
open 127.0.0.1:5000
>```


### Install

>```bash
npm install
>```

### Create a Firebase project

https://console.firebase.google.com/

### login with ci use token
>```
firebase login:ci
>```

### Update database rules

>```
firebase deploy --project "$FIREBASE_PROJECT" --token "$FIREBASE_TOKEN" --non-interactive --only database
>```


### Start

>```bash
npm start
>```

### Build a bundle in local

>```bash
wercker build --direct-mount
cd target && python -M SimpleHTTPServer
open http://127.0.0.1:8000
>```
