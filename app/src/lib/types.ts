// ロケール定義。増やす場合はここに追加する。
export const LOCALES = ['ja', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

// ツールの種類、ツールテンプレ選択にもつかう。増やす場合はここに追加する。
export type Category = 'webapp' | 'library' | 'extension';

//一覧表示のグループわけ
export const AUDIENCES = ['enduser', 'developer'] as const;

export type Audience = (typeof AUDIENCES)[number];

// tools.json 用（id をキーとした辞書）
export type ToolsMap = Record<string, ToolEntry>;

// ツール本体のロケール別コンテンツ
export interface ToolContent {
	name: string;
	description: string;
	tagline: string;
	whatFor: string[];
}

// tools.json の1要素
export interface ToolEntry {
	category: Category;
	audience: Audience;
	websiteUrl: string;
	githubRepo: string;
	screenshots: string[];
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

export type AudienceI18n = Record<Locale, Record<Audience, string>>;

export interface FaqContent {
	question: string;
	answer: string;
}
export interface FaqEntry {
	id: string;
	ja: FaqContent;
	en: FaqContent;
}
