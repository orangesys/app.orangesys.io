[![dependencies Status](https://david-dm.org/orangesys/app.orangesys.io.svg)](https://david-dm.org/orangesys/app.orangesys.io)
[![CircleCI](https://circleci.com/gh/orangesys/app.orangesys.io.svg?style=svg)](https://circleci.com/gh/orangesys/app.orangesys.io)


### Config

```
cp .env-sample .env
```

### Change api key with .env

```
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

### Install

```
npm install
```


### Create a Firebase project

https://console.firebase.google.com/


### Login with ci use token
```
firebase login:ci
```

### Update database rules

```
firebase deploy --project "$FIREBASE_PROJECT" --token "$FIREBASE_TOKEN" --non-interactive --only database
```

### Deploy firebase functions

```
firebase functions:config:set stripe.secret_key="xxxxxxxxxxxxxxx"
firebase functions:config:set mail.mailjet_public_key="xxxxxxxxxxxxxxx"
firebase functions:config:set mail.mailjet_private_key="xxxxxxxxxxxxxxx"
firebase functions:config:set mail.from="noreply@example.com"
firebase functions:config:set mail.to="system-group@example.com"
npm run functions:deploy
```


### Start

```
npm start
```
