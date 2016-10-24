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

## PROD環境

GKE


## Offcial site

## home page

作成予定ですが、優先順位を下げます。

## ユーザー登録ページ

決済

stripe

sign up時、必要情報：名前、email、社名、カード情報

## ログイン流れ
![usersingup](http://g.gravizo.com/g?
digraph G {
  usersingup -> { firebase; stripe};
  { firebase; stripe} -> helm;
  helm -> usersingup [style=bold, label="response consumer_id&token"];
  helm -> kong;
  helm -> grafana;
  helm -> influxdb;
  rankdir=LR;
}
)

## logging
containerを運用のため、stderr/stdoutへ

## 外部URL

- FAQ(zendesk)
- grafana
- その他

## Versioning
A version must follow the [SemVer 2](http://semver.org/) standard.

## 参照

- https://www.campaignmonitor.com/
- https://cloud.influxdata.com/
