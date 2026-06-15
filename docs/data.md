

### データの置き場所

```
src/lib/data/tools/
  lumilumi.json
  lumilumi.ja.json
  lumilumi.en.json
src/lib/i18n/
  categories.ja.json
  usages.ja.json
  difficulties.ja.json
```

`static/` には置かない。`import.meta.glob` でビルド時に読み込む。

---

### データ編集（dev環境のみ）

```
src/routes/
  gui/
    +page.svelte          ← 編集フォームUI
    +page.server.ts       ← prerender = false + DEVチェック
  api/tools/
    +server.ts            ← prerender = false + GET/POSTでJSONを読み書き
```

**`prerender = false` を必ず書く。** これがないと `adapter-static` がビルド時にエラーを出す。

```typescript
// src/routes/api/tools/+server.ts
export const prerender = false
```

```typescript
// src/routes/gui/+page.server.ts
export const prerender = false
// + import.meta.env.DEV でなければ404
```

`prerender = false` のルートはビルド出力に含まれない。dev環境では通常通り動く。

---

### ビルド・デプロイ

```
+page.ts  → import.meta.glob でJSONを全件読み込み
          → SvelteKitが静的ページを生成
          → adapter-static で出力
```

| ルート | ビルド出力 | dev |
|---|---|---|
| `/tools/[slug]` | 含まれる | 動く |
| `/gui` | 含まれない | 動く |
| `/api/tools` | 含まれない | 動く |

---

### やる順序

1. `lumilumi.json` / `lumilumi.ja.json` を手書きで1件作る
2. `+page.ts` でロード、`+page.svelte` で表示（見た目は雑でいい）
3. ブラウザで確認してフィールド構成を確定する
4. `/gui` + `/api/tools` を実装してJSONを編集できるようにする
5. 構造が安定したら残りのツールをGUI経由で登録していく