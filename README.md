# app.orangesys.io

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

TODO:

- [ ] CircleCI
- [ ] Codacy Badge
- [ ] dependencies Status

## Env

- node.js 10+
- yarn

## Config

```sh
cp .env-sample .env
```

```sh
# edit .env
NODE_ENV=development
REACT_APP_FIREBASE_API_KEY=XXXXXXXXXXXXXXXXXXXXX
REACT_APP_FIREBASE_AUTH_DOMAIN=orangesys-36d6e.firebaseapp.com
REACT_APP_FIREBASE_DATABASE_URL=https://orangesys-36d6e.firebaseio.com
REACT_APP_FIREBASE_STORAGE_BUCKET=orangesys-36d6e.appspot.com
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_XXXXXXXXXXXXXXXXXXXXX
REACT_APP_PAYMENT_API_ENDPOINT=https://PAYMENT_API_ENDPOINT
REACT_APP_ORANGESYS_API_ENDPOINT=https://ORANGESYS_API_ENDPOINT
REACT_APP_SENTRY_DSN=https://XXXXXXXX@sentry.io/YYYYYYY
REACT_APP_GA_TRACKING_ID=UA-XXXXXXXX-Y
```

## Install

```sh
yarn
```

## Test

```sh
yarn test
```

## Create a Firebase project

For more information, see <https://console.firebase.google.com>

## Login with ci use token

```bash
firebase login:ci

firebase use [project_id]
```

## Update database rules

```bash
firebase deploy --project "$FIREBASE_PROJECT" --token "$FIREBASE_TOKEN" --non-interactive --only database
```

## Start in development

```
yarn start
```

## Build

```
yarn build
```

## Build with

- [React](https://github.com/facebook/react)
  - Main framework for runtime.
- [typescript](https://www.typescriptlang.org/)
  - Type checker
- [emotion](https://github.com/emotion-js/emotion)
  - CSS IN JS
- [Reach/Router](https://github.com/reach/router)
  - Router
- [Xstate](https://github.com/davidkpiano/xstate)
  - JavaScript state machines and statecharts
- [Material-UI](https://github.com/mui-org/material-ui)
  - UI Component
- [React Hook Form](https://github.com/react-hook-form/react-hook-form)
  - Form Helper
- [firebase](https://github.com/firebase/firebase-js-sdk)
  - OAuth and DB
- [@stripe/react-stripe-js](https://github.com/stripe/react-stripe-js)
  - Payment
- [date-fns](https://date-fns.org/)
  - Modern JavaScript date utility library

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
