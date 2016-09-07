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
別のものがあれば、URLを教えて下さい

## フレームワーク

react
redux
react-route 

## DB

firebase 

## リリース環境

GKEを利用し、k8sを使います。 # 通信 HTTPS


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

kong認証用のjwt作成、firebaseに保存 (優先順位下げる、最後)
サンプルコード:

```
npm install node-uuid
var uuid = require('node-uuid');
var rand = uuid.v1().split('-').join(''); // 661708030ec74627a12d3f6c6f8f5dd2
```

kong を使ってます。下記はkong jwt認証時、のPOSTです。

```
http POST http://<KONG SERVER>:8001/consumers/influx0000/jwt \
key=cce40d906f5b46188d060c738c7746b4 \
secret=f0436ede68654f0bbebc82f703b9406d
```

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

## 参照

https://www.campaignmonitor.com/

- https://repro.io/
- https://cloud.influxdata.com/
