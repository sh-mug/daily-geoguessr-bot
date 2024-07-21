# GeoGuessr Daily Challenge Poster

このプロジェクトは、GeoGuessr のデイリーチャレンジを作成し、そのチャレンジの結果を Discord チャンネルに投稿する Node.js アプリケーションです。プロジェクトは TypeScript で開発され、Discord API とのやり取りには `discord.js` を使用しています。

## 必要条件

- Node.js
- npm
- Discord bot トークンと Discord チャンネル ID
- GeoGuessr アカウント

## セットアップ

1. リポジトリをクローンします：
    ```bash
    git clone https://github.com/sh-mug/daily-geoguessr-bot.git
    cd daily-geoguessr-bot
    ```

2. 依存関係をインストールします:
    ```bash
    npm install
    ```

3. `.env.example` をプロジェクトのルートディレクトリにコピーして `.env` ファイルを作成し、以下の環境変数を設定してください：
    ```plaintext
    GEOGUESSR_EMAIL=your-geoguessr-email@gmail.com
    GEOGUESSR_PASSWORD=your-geoguessr-password
    DISCORD_TOKEN=your-discord-bot-token
    DISCORD_CHANNEL_ID=your-discord-channel-id
    ```

4. TypeScript コードをコンパイルします:
    ```bash
    npx tsc
    ```

## 使用方法

### スタンドアロンモード

スタンドアロンモードでは、細かい設定なしでスケジュールタスクを自動的に実行します。スタンドアロンモードで動かすには以下を実行してください。

```bash
npm run standalone
```

このモードでは、以下のスケジュールが使用されます:
- `challenge` は毎日 0 時に実行され、新しい GeoGuessr チャレンジを作成します。
- `highscores` は毎日 23 時に実行され、前日のチャレンジのハイスコアを Discord に投稿します。

### サーバーモード

サーバーモードでは、Express サーバーが公開するエンドポイントにアクセスし、手動でタスクを実行することが可能です。サーバーモードで動かすには以下を実行してください。

```bash
npm start
```

このモードでは、以下のエンドポイントが利用可能です:
- `GET /challenge` - `challenge` をトリガーします。
- `GET /highscores` - `highscores` をトリガーします。

### Crontab設定

スタンドアロンモードではなく `crontab` を使用してタスクをスケジュールしたい場合は、以下のように `crontab` エントリを設定できます:

1. crontab エディタを開きます:

    ```bash
    crontab -e
    ```

2. `challenge` と `highscores` をスケジュールするために以下のエントリを追加します:

    ```crontab
    0 0 * * * curl http://localhost:25000/challenge
    0 23 * * * curl http://localhost:25000/highscores
    ```

## プロジェクト構成

- `src/`
  - `geoguessr-api/`
    - `login.ts` - GeoGuessr へのログインとクッキーの管理を担当します。
    - `challenge.ts` - 新しい GeoGuessr チャレンジの作成を担当します。
    - `highscores.ts` - GeoGuessr チャレンジのハイスコアの取得を担当します。
  - `discord/`
    - `discordPoster.ts` - Discord へのメッセージ投稿を担当します。
  - `server.ts` - アプリケーションのエントリーポイントです。

## 環境変数

- `GEOGUESSR_EMAIL`: GeoGuessr アカウントのメールアドレス。
- `GEOGUESSR_PASSWORD`: GeoGuessr アカウントのパスワード。
- `DISCORD_TOKEN`: Discord ボットトークン。
- `DISCORD_CHANNEL_ID`: メッセージが投稿される Discord チャンネルの ID。

## 重要な注意事項

- ボットが指定された Discord チャンネルにメッセージを投稿するための必要な権限を持っていることを確認してください。
- 認証情報には注意し、`.env` ファイルをバージョン管理にコミットしないようにしてください。
- 初回ログイン時に GeoGuessr のクッキーを `cookie.txt` に保存します。このクッキーは1年間有効です。有効期限が切れたら、手動で `cookie.txt` を削除してください。
- GeoGuessr の API 仕様により、チャレンジの結果を取得するためには、チャレンジ作成者が毎日チャレンジをプレイする必要があります。

## ライセンス

このプロジェクトは MIT ライセンスのもとでライセンスされています。詳細は [LICENSE](LICENSE) ファイルを参照してください。

## コントリビューション

コントリビューション歓迎です！改善点やバグ修正のために、Issue を作成するか、PR を送信してください。

## お問い合わせ

質問やサポートが必要な場合は、GitHub リポジトリで Issue を開いてください。