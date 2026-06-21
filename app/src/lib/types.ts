// ロケール定義。増やす場合はここに追加する。
export type Locale = 'ja' | 'en';

// ツール本体のロケール別コンテンツ
export interface ToolContent {
    name: string;
    description: string;
}

// tools.json の1要素
export interface ToolEntry {
    id: string;
    en: ToolContent;
    ja: ToolContent;
}

// ニーズカードのロケール別コンテンツ
export interface NeedContent {
    title: string;
}

// needs.json の1要素
// toolList は ToolEntry.id への外部キー的参照
export interface NeedEntry {
    id: string;
    icon: string;
    en: NeedContent;
    ja: NeedContent;
    toolList: string[];
}

// features.json は ToolEntry.id の配列そのもの
export type FeatureEntry = string;

// 参照整合性チェックの結果
export interface ValidationError {
    source: 'needs' | 'features';
    sourceId: string;
    missingToolId: string;
}