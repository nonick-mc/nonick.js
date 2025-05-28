# NoNICK.js Dashboard

[Next.js](https://nextjs.org)で構築された、NoNICK.jsの設定を管理するWebダッシュボード

![preview](/.github/assets/thumbnail.png)

## 📑Usage
### Discordアプリケーションを作成する
まず、[Discord開発者ポータル](https://discord.com/developers/applications)でWebダッシュボードに使うDiscordアプリケーションを作成する必要があります。アプリケーションを作成したら、「OAuth2」タブにアクセスし、`Redirects`に以下のURLを追加してください。

* `http://localhost:3000/api/auth/callback/discord`
* `http://localhost:3000`

### 環境変数を設定する
アプリケーションを作成したら、ルートディレクトリに`.env.local`を作成し、同ディレクトリにある[`.env.sample`](/.env.sample)を基に環境変数を設定してください。

### 開発サーバーを起動する
設定が終わったら、以下のコマンドを使用して開発サーバーを起動します。

```sh
pnpm dev
```

