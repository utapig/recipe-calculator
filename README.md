# 料理レシピ材料計算アプリ

レシピと人数を指定して、必要な材料をグラム（g）単位で自動計算し、パッケージ単位の補助表記も行うモバイル向けWebアプリケーションです。

## 主な機能
- **自動計算**: レシピと人数を掛け合わせ、必要なグラム数を一日計算。
- **パッケージ補助表記**: 「1ケース6本入り」「4kg × 2袋」などの情報に基づき、発注の目安となるパッケージ単位の表記を追加で表示します。
- **ハイライト・アラート**: 「納期未定になりがち」「★」マークが付いた特別/注意事項のある材料を目立たせて表示します。
- **共有機能**: 計算結果をテキストとしてクリップボードにコピーしたり、端末の共有機能（LINEなど）で簡単に送ることができます。
- **マスター管理**: 提供された材料データをプリセットとして保持し、画面上からレシピの作成や新規材料の追加が可能です。

## 開発環境のセットアップ

1. 依存関係のインストール
   ```bash
   npm install
   ```

2. 開発サーバーの起動
   ```bash
   npm run dev
   ```

### DB連携でフロントとAPIを同時起動

```bash
npm run dev:full
```

- フロント: `http://localhost:5173`
- API: `http://localhost:3001`

Viteの `/api` はAPIサーバーへプロキシされます。

### デプロイ時にDB反映されない場合

静的ホスティングにフロントだけをデプロイすると、`/api` が存在せずDB更新はできません。

本番では次の2点が必要です。

1. APIサーバー（`server/api.js`）を別途デプロイ
2. フロントに `VITE_API_BASE_URL` を設定

例:

```env
VITE_API_BASE_URL="https://your-api.example.com"
```

加えてAPI側では、フロントドメインを `CORS_ORIGIN` に設定してください。

## 技術スタック
- React (Vite / TypeScript)
- Vanilla CSS (Mobile First Design)
- Local Storage (データ永続化 / PWA ready)

## Tailwind CSS 調整環境

このプロジェクトは Tailwind CSS を追加済みです。既存UIの崩れを避けるため、`tailwind.config.js` で `preflight: false` にしています。

調整ポイント:
- `tailwind.config.js`: テーマ拡張、プリセット、plugins
- `src/index.css`: `@tailwind` ディレクティブと既存スタイル

まずは開発サーバーを起動して、コンポーネントにTailwindクラスを追加して調整してください。

## Neon + Prisma セットアップ

1. NeonでProjectを作成し、接続情報を取得
2. `.env.example` をコピーして `.env` を作成
3. `DATABASE_URL` にはNeonのPooler接続文字列、`DIRECT_URL` にはDirect接続文字列を設定
4. Prisma Clientを生成

```bash
npm run prisma:generate
```

5. 初期スキーマをNeonへ反映

```bash
npm run prisma:push
```

6. Prisma Studioで内容確認（任意）

```bash
npm run prisma:studio
```

7. 初期データを投入（任意）

```bash
npm run prisma:seed
```

`prisma/seed.ts` は `src/data/ingredients.ts` と `src/data/recipes.ts` の初期データを、Neonの `Ingredient` / `Recipe` / `RecipeIngredient` に反映します。

### 使うテーブル構成
- `Ingredient`: 材料マスター
- `Recipe`: レシピマスター
- `RecipeIngredient`: レシピと材料の中間テーブル（分量 `amountG` と並び順 `sortOrder` を保持）

Prismaスキーマは [prisma/schema.prisma](prisma/schema.prisma) にあります。
