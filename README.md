[![devDependencies Status](https://david-dm.org/orangesys/orangesys.io/dev-status.svg)](https://david-dm.org/orangesys/orangesys.io?type=dev)

## Dev in Docker
- Docker version > 1.10.0

#build
```
sh build.sh
```
#run

```
cat << EOF >  /tmp/env
NODE_ENV=development
FIREBASE_API_KEY=XXXXXXXXXXXXXXXXXXXXX
FIREBASE_AUTH_DOMAIN=orangesys-21d3f.firebaseapp.com
FIREBASE_DATABASE_URL=https://orangesys-21d3f.firebaseio.com
FIREBASE_STORAGE_BUCKET=orangesys-21d3f.appspot.com
PAYMENT_API_ENDPOINT=https://ENDPOINT
HOST=0.0.0.0
```

ex)
```
docker run -d -v /tmp/env:/usr/src/app/.env -p 5000:5000 orangesys.io:0.1.0
```

## Development Settings

### Install

```
npm install
```

### Create a Firebase project

https://console.firebase.google.com/

### Set environment variables

```
cp .env-sample .env
# edit .env
```

### Start

```
npm start
```

### Build a bundle

```
npm run build
```
