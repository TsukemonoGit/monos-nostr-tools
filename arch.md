# Svelte 5 ミニサンプル — snippet/render によるデザイン・ロジック分離

## ファイル構成

```
src/
├── lib/
│   ├── types.ts
│   ├── i18n/
│   │   ├── categories.ja.json    ← category enum の表示名（全ツール共通）
│   │   ├── categories.en.json
│   │   ├── usages.ja.json        ← usage enum の表示名
│   │   ├── usages.en.json
│   │   ├── difficulties.ja.json  ← difficulty enum の表示名
│   │   ├── difficulties.en.json
│   │   └── purposes.ja.json      ← features タグの表示名（必要なら）
│   ├── data/
│   │   └── tools/
│   │       ├── lumilumi.json          ← 共通（翻訳不要）
│   │       ├── lumilumi.ja.json       ← 日本語テキスト
│   │       ├── lumilumi.en.json       ← 英語テキスト
│   │       ├── nfo2.json
│   │       ├── nfo2.ja.json
│   │       └── ...
│   └── components/
│       ├── NeedsSection.svelte
│       ├── FeaturedTools.svelte
│       └── ToolDetail/
│           ├── Screenshots.svelte     ← カルーセル
│           └── NextTools.svelte       ← 次のツール一覧
└── routes/
    ├── +page.svelte                   ← トップページ
    └── tools/
        └── [slug]/
            ├── +page.ts               ← load: JSON 結合
            └── +page.svelte           ← 詳細ページ
```

---

## `src/lib/types.ts`

```typescript
/** tools/[slug].json — 翻訳不要。URL・ID・enum を書く */
export type ToolShared = {
  name: string           // 固有名詞。全言語共通（例: "Lumilumi"）
  category: string       // enum: "client" | "backup" | "relay" | ...
  usage: string          // enum: "web-open" | "app-download" | "cli" | ...
  difficulty: string     // enum: "beginner" | "intermediate" | "advanced"
  websiteUrl: string
  githubRepo?: string    // "owner/repo" 形式
  nostrNoteId?: string   // Nostr から星数フェッチに使う
  nextTools: string[]    // slug の配列
  screenshots: string[]  // ⚠ 管理方法未決定（パス or URL）
}

/** tools/[slug].{locale}.json — ロケール別テキスト */
export type ToolLocale = {
  tagline: string        // 1行キャッチコピー
  description: string    // 「これは何？」欄。1〜2文
  whatFor: string[]      // 「こんな人におすすめ」。各項目「〜したい人」形式
  difficultyReason: string  // 難易度の補足（例: "nsec 管理不要、開いたらすぐ使える"）
  features: string[]     // 機能タグ（例: ["低通信量モード", "poll 対応"]）
}

/** ページで扱う結合済み型 */
export type Tool = ToolShared & ToolLocale & {
  slug: string
  stars?: number         // Nostr からフェッチ（nostrNoteId 経由）
}

/** Nostr からフェッチした星数 */
export type StarCounts = Map<string, number>

export type Need = {
  id: string
  label: string
  toolIds: string[]
}
```

---

## データファイル サンプル

### `tools/lumilumi.json`

```json
{
  "name": "Lumilumi",
  "category": "client",
  "usage": "web-open",
  "difficulty": "beginner",
  "websiteUrl": "https://lumilumi.app",
  "githubRepo": "TsukemonGit/lumilumi",
  "nostrNoteId": "note1xxxxxxxxxxxxxxxx",
  "nextTools": ["shosai", "nfo2"],
  "screenshots": []
}
```

### `tools/lumilumi.ja.json`

```json
{
  "tagline": "低通信量で使える機能豊富な Nostr Web クライアント",
  "description": "Nostr を Web ブラウザで使えるクライアント（SNS アプリ）。インストール不要で、URL を開けばすぐに使えます。",
  "whatFor": [
    "モバイル回線で通信量を抑えて Nostr を使いたい人",
    "poll（投票）機能を使いたい人",
    "位置情報（geohash）を投稿・閲覧したい人",
    "Nostr の長文記事（Kind 30023）を読みたい人",
    "機能が豊富な Web クライアントが欲しい人"
  ],
  "difficultyReason": "nsec 管理不要、開いたらすぐ使える",
  "features": ["低通信量モード", "poll 対応", "geohash 対応", "長文記事対応", "PWA 対応"]
}
```

### `tools/lumilumi.en.json`

```json
{
  "tagline": "A feature-rich Nostr web client with low data usage",
  "description": "A browser-based Nostr client (SNS app). No installation required — just open the URL.",
  "whatFor": [
    "People who want to use Nostr with low mobile data consumption",
    "People who want to use the poll feature",
    "People who want to post or browse location info (geohash)",
    "People who want to read long-form Nostr articles (Kind 30023)",
    "People who want a feature-rich web client"
  ],
  "difficultyReason": "No nsec management needed, ready to use immediately",
  "features": ["Low data mode", "Poll support", "Geohash support", "Long-form articles", "PWA support"]
}
```

### `i18n/categories.ja.json`（enum → 表示名。各ツールファイルには書かない）

```json
{
  "client": "クライアント",
  "backup": "バックアップ",
  "relay": "リレー",
  "list": "リスト管理",
  "dev": "開発者向け"
}
```

### `i18n/usages.ja.json`

```json
{
  "web-open": "Web ブラウザで開く",
  "app-download": "アプリをダウンロード",
  "cli": "コマンドラインで使う"
}
```

### `i18n/difficulties.ja.json`

```json
{
  "beginner": "初心者向け",
  "intermediate": "中級者向け",
  "advanced": "上級者向け"
}
```

---

## `routes/tools/[slug]/+page.ts`

```typescript
import type { PageLoad } from './$types'
import type { Tool } from '$lib/types'

// Vite の import.meta.glob でビルド時に全 JSON を読み込む
const sharedFiles  = import.meta.glob('/src/lib/data/tools/*.json',    { eager: true, import: 'default' })
const localeFiles  = import.meta.glob('/src/lib/data/tools/*.*.json',  { eager: true, import: 'default' })

export const load: PageLoad = ({ params, url }) => {
  const { slug } = params
  const locale = url.searchParams.get('lang') ?? 'ja'  // またはストアで管理

  const shared  = sharedFiles[`/src/lib/data/tools/${slug}.json`]
  const localeData = localeFiles[`/src/lib/data/tools/${slug}.${locale}.json`]

  if (!shared || !localeData) {
    throw new Error(`Tool not found: ${slug}`)
  }

  return {
    tool: { ...shared, ...localeData, slug } as Tool,
    locale
  }
}
```

---

## `routes/tools/[slug]/+page.svelte`

```svelte
<script lang="ts">
  import type { PageData } from './$types'
  import type { StarCounts } from '$lib/types'
  import Screenshots from '$lib/components/ToolDetail/Screenshots.svelte'
  import NextTools   from '$lib/components/ToolDetail/NextTools.svelte'

  import categoriesJa from '$lib/i18n/categories.ja.json'
  import usagesJa     from '$lib/i18n/usages.ja.json'
  import difficultiesJa from '$lib/i18n/difficulties.ja.json'

  let { data }: { data: PageData } = $props()
  const { tool } = data

  let starCounts = $state<StarCounts>(new Map())

  // Nostr からのフェッチは onMount 等で実装（tool.nostrNoteId を使う）
  // $effect(() => { fetchStars(tool.nostrNoteId).then(n => starCounts.set(tool.slug, n)) })

  const stars = $derived(starCounts.get(tool.slug))
</script>

<!-- ===== snippet: 機能タグ1件 ===== -->
{#snippet featureTag(label: string)}
  <span class="feature-tag">{label}</span>
{/snippet}

<!-- ===== snippet: リンクボタン ===== -->
{#snippet linkButton(href: string, label: string)}
  <a class="link-btn" {href} target="_blank" rel="noopener noreferrer">
    {label} ↗
  </a>
{/snippet}

<article class="tool-detail">
  <!-- ① name + category -->
  <header>
    <h1>{tool.name}</h1>
    <span class="category-badge">{categoriesJa[tool.category]}</span>
  </header>

  <!-- tagline -->
  <p class="tagline">{tool.tagline}</p>

  <!-- ④ screenshot carousel -->
  <Screenshots paths={tool.screenshots} />

  <!-- ⑤ これは何？ -->
  <section class="what">
    <h2>これは何？</h2>
    <p>{tool.description}</p>
  </section>

  <!-- ⑥ こんな人におすすめ -->
  <section class="who">
    <h2>こんな人におすすめ</h2>
    <ul>
      {#each tool.whatFor as item}
        <li>{item}</li>
      {/each}
    </ul>
  </section>

  <!-- ③ 使い方 / ④ 難易度 -->
  <div class="meta-row">
    <dl class="usage">
      <dt>使い方</dt>
      <dd>{usagesJa[tool.usage]}</dd>
    </dl>
    <dl class="difficulty">
      <dt>難易度</dt>
      <dd>{difficultiesJa[tool.difficulty]}</dd>
      <dd class="reason">{tool.difficultyReason}</dd>
    </dl>
  </div>

  <!-- ⑨ 主な機能 -->
  <section class="features">
    <h2>主な機能</h2>
    <div class="tag-list">
      {#each tool.features as f}
        {@render featureTag(f)}
      {/each}
    </div>
  </section>

  <!-- Nostr フェッチの星数 -->
  {#if stars !== undefined}
    <span class="stars">★ {stars}</span>
  {/if}

  <!-- ⑩ リンク -->
  <div class="links">
    {@render linkButton(tool.websiteUrl, '公式サイトで開く')}
    {#if tool.githubRepo}
      {@render linkButton(`https://github.com/${tool.githubRepo}`, 'GitHub')}
    {/if}
    {#if tool.nostrNoteId}
      {@render linkButton(`https://njump.me/${tool.nostrNoteId}`, 'Nostr で紹介 note')}
    {/if}
  </div>

  <!-- ⑪ 次のツール -->
  <NextTools slugs={tool.nextTools} />
</article>
```

---

## 各ツールファイルに書く/書かない整理

| フィールド | ファイル | 備考 |
|---|---|---|
| name | `[slug].json` | 固有名詞、全言語共通 |
| category | `[slug].json` | enum のみ。表示名は `i18n/categories.*.json` |
| usage | `[slug].json` | enum のみ。表示名は `i18n/usages.*.json` |
| difficulty | `[slug].json` | enum のみ。表示名は `i18n/difficulties.*.json` |
| websiteUrl / githubRepo / nostrNoteId | `[slug].json` | URL・ID |
| nextTools | `[slug].json` | slug の配列 |
| screenshots | `[slug].json` | ⚠ 管理方法未決定 |
| tagline | `[slug].{locale}.json` | 1行キャッチコピー |
| description | `[slug].{locale}.json` | 「これは何？」欄 |
| whatFor | `[slug].{locale}.json` | 「こんな人におすすめ」配列 |
| difficultyReason | `[slug].{locale}.json` | 難易度補足 |
| features | `[slug].{locale}.json` | 機能タグ配列 |
| stars | どこにも書かない | Nostr から nostrNoteId 経由でフェッチ |
| status / featured / publishedAt | どこにも書かない | 管理用メタデータ、テキスト執筆不要 |