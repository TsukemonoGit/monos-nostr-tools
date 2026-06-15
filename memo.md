- ソレゾレのアプリのnostr 30078をつくり、イイネ数を表示また、いいねが押せるようにする(匿名ランダム鍵で) Donさんのまきびし
- ザップ機能とかもつけるしそれ以外でのサポート？てきなのもつける ロクヨウさんのzapぼたん
- URLをコピー(共有ぼたんてきなやつ)


# 戦略比較

## 比較表

| | 案A Workers+KV | 案B 毎回backward | 案C localStorage |
|---|---|---|---|
| リレー負荷 | Worker が代表、訪問者数に非依存 | 訪問者×訪問ごとに発生 | 訪問者ごとに初回のみ発生 |
| リロード時 | KV から即時 | また backward から | localStorage から即時 |
| 初期表示 | 即時 | backward 完了まで待機 | 初回のみ待機、以降は即時 |
| インフラ | Workers + KV + Cron | なし | なし |
| 別デバイス・シークレット | 影響なし（KV共通） | 毎回 backward | 初回 backward が走る |
| 複数タブ競合 | なし（KV共通） | なし（揮発） | **カウント二重加算リスク** |

---

## 案C 詳細戦略

### 起動時

1. localStorage に `{reactions, until}` が存在するか確認
2. **キャッシュなし** → backward pagination 実行（後述）
3. **キャッシュあり** → localStorage から即時表示 → `since: until` で forward 購読開始

### backward pagination

```
until = 現在時刻
loop:
  REQ { kinds:[7], #a:[全ツール], until, limit:500 }
  返ってきたイベントを reactions にカウント加算
  返ってきた数 < 500 → 枯渇とみなしてループ終了
  until = min(events.created_at) - 1
```

終了後、`{reactions, until}` を localStorage に保存し、forward 購読開始

### forward 購読中

- `{ kinds:[7], #a:[全ツール], since: until }` を購読
- 新着 kind:7 が届くたびに該当ツールの reactions をインクリメント
- **定期保存**（例: 30秒ごと）で localStorage の `{reactions, until}` を上書き更新
  - `until` は保存時刻。イベントが届いていない期間も含めて「ここまで確認済み」として記録する

### 切断・復帰時

- 全リレー切断 → 定期保存を停止（`until` を凍結）接続復帰しても保存しない


### 複数タブ競合への対処

現実的には無視を推奨。同一ユーザーが同一ページを複数タブで同時に開くケースは稀で、発生しても次の定期保存で上書きされる（永続的な破損にはならない）。


idを保存する(カウントしたしてないがわかるように)
