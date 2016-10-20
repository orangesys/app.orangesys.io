[![devDependencies Status](https://david-dm.org/orangesys/orangesys.io/dev-status.svg)](https://david-dm.org/orangesys/orangesys.io?type=dev)
[![wercker status](https://app.wercker.com/status/14409ed8bedeb4f9e6f5e9d11f120aa5/s/master "wercker status")](https://app.wercker.com/project/byKey/14409ed8bedeb4f9e6f5e9d11f120aa5)

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
PAYMENT_API_ENDPOINT=https://ENDPOINT
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

### Set environment variables

```
```

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
