# NoNICK.js Database
NoNICK.jsのデータベースに使用されるスキーマを管理するリポジトリ  

## 📑Usage
このリポジトリのスキーマファイルは、他のリポジトリに追加して使用することができます。

- **Git Submodule** を使用する場合：
  ```bash
  git submodule add -b main https://github.com/nonick-js/database path/to/submodule database
  ```

- **Git Subtree** を使用する場合：
  ```bash
  git subtree add --prefix=path/to/subtree https://github.com/nonick-js/database main --squash
  ```

また、以下の依存関係を追加する必要があります。
```bash
bun add drizzle-orm drizzle-zod i18next pg zod zod-i18n-map
bun add -D discord-api-types
```
