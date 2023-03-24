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
export BASE_URL=<API Gatewayのエンドポイント>
# getAll
curl -X GET -H "Content-Type: application/json" ${BASE_URL}/v1/items

# getAll
curl -X GET -H "Content-Type: application/json" ${BASE_URL}/v1/items/2f265a5f-75b8-435e-98fd-59ca70dac8b6

# create
curl -X POST -H "Content-Type: application/json" ${BASE_URL}/v1/items -d '{"uid": "sample-uid", "messageJson": "{ \"key\": \"value\" }", "sentDate": "2023-04-01T12:00:00.000Z"}'

# update
curl -X PUT -H "Content-Type: application/json" ${BASE_URL}/v1/items/6f06ff4d-085a-4343-8a66-8a0bdba12f59 -d '{"uid": "new-uid","messageJson": "{ \"key\": \"value\" }","sentDate":"2023-03-30T12:00:00Z"}'

# delete
curl -X DELETE -H "Content-Type: application/json" ${BASE_URL}/v1/items/6f06ff4d-085a-4343-8a66-8a0bdba12f59
```
