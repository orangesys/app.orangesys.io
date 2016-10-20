[![devDependencies Status](https://david-dm.org/orangesys/orangesys.io/dev-status.svg)](https://david-dm.org/orangesys/orangesys.io?type=dev)
## site color code

### MDL

DeepOrange
Blue

## DB

### Firebaseを使います。今後DBに保存する情報を増える予定。

ユーザー情報
kong jwt
通信用のサブドメインなど


## site layout

Flexible Box

## フレームワーク

react
redux
react-route

## DB

firebase

## リリース環境

GKE


## Offcial site

## home page

作成予定ですが、優先順位を下げます。

## ユーザー登録ページ

決済

webpayか
stripe
カード情報を保存しない

※開発しやすいため、stripeにします。但し、JCBが非対応。最後、決済会社の審査によって、変更可能性あり
PLAN選択、変更

kong認証用のjwt作成、firebaseに保存
backend対応、backendのAPIにアクセスが必要

ユーザー登録の流れ

- sign up
  - email -> confirm email    ->    カード情報登録 　  -> jwt作成
  - google                              ->    カード情報登録   　  -> jwt作成
  - github                              ->    カード情報登録   　  -> jwt作成

sign up時、必要情報：名前、email、社名、カード情報

## 外部URL

- FAQ(zendesk)
- grafana
- その他

## Versioning
A version must follow the [SemVer 2](http://semver.org/) standard.

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
docker run -d -v /tmp/env:/var/www/.env -p 5000:5000 orangesys.io:1.0.0
```

## 参照

https://www.campaignmonitor.com/

- https://repro.io/
- https://cloud.influxdata.com/


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
