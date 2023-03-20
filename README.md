# sample-line-delivery

LINE Messaging API で配信を行うためのサンプルアプリ
![](docs/archtecture.drawio.png)

## デプロイ

```
cd liff
yarn export
cd ..
cd cdk
npx cdk deploy
```

## 機能

- 管理画面
  - 配信予約が行える
    - uid のリストと json と配信時刻を登録

## テスト

- API

```bash:
export BASE_URL=https://yz4v4imz6j.execute-api.ap-northeast-1.amazonaws.com
# get
curl -X GET ${BASE_URL}/v1/items

# create
curl -X POST ${BASE_URL}/v1/items

# update
curl -X PUT ${BASE_URL}/v1/items

# delete
curl -X DELETE ${BASE_URL}/v1/items
```
