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

/** Nostr からフェッチした星のノートIDリスト key:atag */
export type StarCounts = Map<string, string[]>

export type SaveStarList = {
    "reactions": StarCounts,
    "until": number //チェック済みのcreated_at
}

/* なにこれ
export type Need = {
    id: string
    label: string
    toolIds: string[]
} */