// ロケール定義。増やす場合はここに追加する。
export const LOCALES = ['ja', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

// ロケールごとに同じ形のコンテンツを持たせるための共通ヘルパー型
export type Localized<T> = Record<Locale, T>;

// ツールの種類。増やす場合はここに追加する。
export type Category = 'webapp' | 'library' | 'extension';

// 一覧表示のグループわけ
export const AUDIENCES = ['enduser', 'developer'] as const;
export type Audience = (typeof AUDIENCES)[number];

// === コンテンツ ===

export interface WhatsNewEntry {
	date: string;
	title: string;
	description?: string;
}

// ToolContent / LibraryContent の共通部分
export interface ContentBase {
	name: string;
	description: string;
	tagline: string;
	features: string[];
	highlights: string[];
	whatsNew: WhatsNewEntry[];
}

// ツール本体のロケール別コンテンツ
export type ToolContent = ContentBase;

// ライブラリ固有のコンテンツ
export interface LibraryContent extends ContentBase {
	install: string;
	example: string;
	api: ApiEntry[];
}

export interface ApiEntry {
	name: string;
	description: string;
}

// === ツールエントリ（Discriminated Union）===

// 共通フィールドのベース型（直接は使わない）
interface ToolEntryBase {
	category: Category;
	audience: Audience;
	websiteUrl: string;
	relatedLinks: RelatedLink[];
	faqs: FaqEntry[];
}

// Web アプリ
export interface WebAppEntry extends ToolEntryBase {
	category: 'webapp';
	screenshots?: string[];
	i18n: Localized<ToolContent>;
}

// ライブラリ
export interface LibraryEntry extends ToolEntryBase {
	category: 'library';
	i18n: Localized<LibraryContent>;
}

// ブラウザ拡張など（今後増やす場合はここに追加）
export interface ExtensionEntry extends ToolEntryBase {
	category: 'extension';
	i18n: Localized<ToolContent>;
}

// ツールの総合型（category で判別する）
export type Tool = WebAppEntry | LibraryEntry | ExtensionEntry;

// tools.json 用（id をキーとした辞書）
export type ToolsMap = Record<string, Tool>;

// === ニーズ ===

export interface NeedContent {
	title: string;
}

// needs.json の1要素
// toolList は Tool（の id）への外部キー的参照
export interface NeedEntry {
	id: string;
	icon: string;
	i18n: Localized<NeedContent>;
	toolList: string[];
}

// features.json は Tool（の id）の配列そのもの
export type FeatureEntry = string;

// === 参照整合性チェック ===

export interface ValidationError {
	source: 'needs' | 'features';
	sourceId: string;
	missingToolId: string;
}

// === FAQ・関連リンク ===

export type AudienceI18n = Record<Locale, Record<Audience, string>>;

export interface FaqContent {
	question: string;
	answer: string;
}

export interface FaqEntry {
	id: string;
	i18n: Localized<FaqContent>;
}

// 関連リンクの種類。増やす場合はここに追加する。
export const RELATEDLINK = [
	'source',
	'docs',
	'slides',
	'publication',
	'support',
	'related-tool',
	'external'
] as const;

export type RelatedLinkType = (typeof RELATEDLINK)[number];

export interface RelatedLinkContent {
	title: string;
	description?: string;
}

export interface RelatedLink {
	type: RelatedLinkType;
	// source / docs / slides / publication / support / external で使用
	url?: string;
	// related-tool で使用
	toolId?: string;
	// external の場合のみ使用。両言語が揃うとは限らないため Partial。
	i18n?: Partial<Localized<RelatedLinkContent>>;
}
