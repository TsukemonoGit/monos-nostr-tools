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

export interface WhatsNewEntry {
	date: string;
	title: string;
	description?: string;
}

// ツール本体のロケール別コンテンツ
export interface ToolContent {
	name: string;
	description: string;
	tagline: string;
	features: string[];
	highlights: string[];
	whatsNew: WhatsNewEntry[];
}

// tools.json の1要素
export interface ToolEntry {
	category: Category;
	audience: Audience;
	websiteUrl: string;
	screenshots?: string[];
	relatedLinks: RelatedLink[];

	en: ToolContent;
	ja: ToolContent;

	faqs: FaqEntry[];
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

// 関連リンクの種類。増やす場合はここに追加する。
export const RELATEDLINK = [
	// ソースコードを閲覧できるページ
	'source',

	// ドキュメント・マニュアル・APIリファレンスなど
	'docs',

	// 登壇資料・発表スライド
	'slides',

	// 書籍・記事・インタビューなど
	'publication',

	// 寄付・スポンサー・OpenSatsなどの支援ページ
	'support',

	// サイト内の別ツールへのリンク
	'related-tool',

	// 上記以外の任意の外部サイト
	'external'
] as const;

export type RelatedLinkType = (typeof RELATEDLINK)[number];

// 関連リンクのロケール別コンテンツ
// external の場合のみ使用
export interface RelatedLinkContent {
	title: string;
	description?: string;
}

// 関連リンク
export interface RelatedLink {
	type: RelatedLinkType;

	// source / docs / slides / publication / support / external で使用
	url?: string;

	// related-tool で使用
	toolId?: string;

	// external の場合のみ使用
	ja?: RelatedLinkContent;
	en?: RelatedLinkContent;
}
