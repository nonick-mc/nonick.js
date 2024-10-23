# NoNICK.js Dashboard

[Next.js](https://nextjs.org)で構築された、NoNICK.jsの設定を管理するWebダッシュボード

![preview](/.github/assets/thumbnail.png)

## 📑Usage
### Discordアプリケーションを作成する
まず、[Discord開発者ポータル](https://discord.com/developers/applications)でWebダッシュボードに使うDiscordアプリケーションを作成する必要があります。アプリケーションを作成したら、「OAuth2」タブにアクセスし、`Redirects`に以下のURLを追加してください。

* `http://localhost:5173/auth/callback`
* `http://localhost:5173/invite/callback`

### 環境変数を設定する
ルートディレクトリに`.env`ファイルを作成し、環境変数を設定します。

|変数名|説明|
|---|---|
|`BASE_URL`|ダッシュボードのベースURL|
|`DATABASE_URL`|MongoDBの接続に使用するURL|
|`DATABASE_NAME`|MongoDBのコレクション名|
|`AUTH_SECRET`|セッションに使用するシークレットキー|
|`AUTH_DISCORD_ID`|DiscordBotのクライアントID|
|`AUTH_DISCORD_SECRET`|DiscordOauth2のクライアントシークレット|
|`DISCORD_TOKEN`|DiscordBotのトークン|

設定が終わったら、以下のコマンドを使用して開発サーバーを起動します。

```sh
pnpm dev
```

