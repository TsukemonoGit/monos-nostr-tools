export interface ToolFaq {
	id: string;
	i18n: Record<string, { question?: string; answer?: string }>;
}

export interface WhatsNewEntry {
	date: string;
	title: string;
}

export type ToolCategory = 'webapp' | 'library' | 'extension';

export interface WebappTool {
	category: 'webapp';
	audience: string;
	websiteUrl: string;
	icon: string;
	screenshots: string[];
	relatedLinks: { type: string; url?: string; toolId?: string }[];
	faqs: ToolFaq[];
	i18n: Record<string, {
		name: string;
		description: string;
		tagline: string;
		highlights: string;
		whatsNew: WhatsNewEntry[];
	}>;
}

export interface LibraryTool {
	category: 'library';
	audience: string;
	websiteUrl: string;
	icon: string;
	usedBy: { title: string; author?: string; url: string }[];
	relatedLinks: { type: string; url?: string; toolId?: string }[];
	faqs: ToolFaq[];
	i18n: Record<string, {
		name: string;
		description: string;
		tagline: string;
		highlights: string;
		whatsNew: WhatsNewEntry[];
	}>;
}

export interface ExtensionTool {
	category: 'extension';
	audience: string;
	websiteUrl: string;
	icon: string;
	relatedLinks: { type: string; url?: string; toolId?: string }[];
	faqs: ToolFaq[];
	i18n: Record<string, {
		name: string;
		description: string;
		tagline: string;
		highlights: string;
		whatsNew: WhatsNewEntry[];
	}>;
}

export type Tool = WebappTool | LibraryTool | ExtensionTool;

function deepClone<T>(obj: T): T {
	if (obj === null || typeof obj !== 'object') return obj;
	if (Array.isArray(obj)) return obj.map(deepClone) as unknown as T;
	const clone: Record<string, unknown> = {};
	for (const key in obj) {
		if (Object.prototype.hasOwnProperty.call(obj, key)) {
			clone[key] = deepClone((obj as Record<string, unknown>)[key]);
		}
	}
	return clone as T;
}

export function useToolDetail(initialTool: Tool | null) {
	let tool = $state<Tool | null>(initialTool ? deepClone(initialTool) : null);

	let editingScreenshot = $state<{ idx: number; url: string } | null>(null);
	let editingInlineScreenshotIdx = $state<number | null>(null);
	let inlineScreenshotValue = $state('');

	let editingUsedBy = $state<{
		idx: number | null;
		entry: { title: string; author?: string; url: string };
	}>({
		idx: null,
		entry: { title: '', url: '' }
	});

	let editingToolFaq = $state<{
		idx: number | null;
		entry: { id: string; i18n: Record<string, { question?: string; answer?: string }> };
	}>({
		idx: null,
		entry: { id: '', i18n: { ja: {}, en: {} } }
	});

	let editingRelatedLink = $state<{
		idx: number | null;
		entry: { type: string; url?: string; toolId?: string };
	}>({
		idx: null,
		entry: { type: '', url: '', toolId: '' }
	});

	let editingWhatsNew = $state<{
		lang: 'ja' | 'en' | null;
		idx: number | null;
		entry: WhatsNewEntry;
	}>({
		lang: null,
		idx: null,
		entry: { date: '', title: '' }
	});

	function setTool(next: Tool | null) {
		tool = next ? deepClone(next) : null;
	}

	function updateField<K extends keyof Tool>(key: K, value: Tool[K]) {
		if (!tool) return;
		tool = { ...tool, [key]: value } as Tool;
	}

	// Screenshots
	function addScreenshot() {
		if (!tool || tool.category !== 'webapp' || !editingScreenshot) return;
		if (!editingScreenshot.url.trim()) return;
		tool.screenshots = [...tool.screenshots, editingScreenshot.url.trim()];
		editingScreenshot = { idx: -1, url: '' };
	}

	function startEditInlineScreenshot(idx: number) {
		if (!tool || tool.category !== 'webapp') return;
		editingInlineScreenshotIdx = idx;
		inlineScreenshotValue = tool.screenshots[idx];
	}

	function saveInlineScreenshot() {
		if (!tool || tool.category !== 'webapp' || editingInlineScreenshotIdx === null || !inlineScreenshotValue.trim()) return;
		tool.screenshots = [
			...tool.screenshots.slice(0, editingInlineScreenshotIdx),
			inlineScreenshotValue.trim(),
			...tool.screenshots.slice(editingInlineScreenshotIdx + 1)
		];
		editingInlineScreenshotIdx = null;
		inlineScreenshotValue = '';
	}

	function cancelEditInlineScreenshot() {
		editingInlineScreenshotIdx = null;
		inlineScreenshotValue = '';
	}

	function removeScreenshot(idx: number) {
		if (!tool || tool.category !== 'webapp') return;
		tool.screenshots = tool.screenshots.filter((_: string, i: number) => i !== idx);
	}

	function moveScreenshot(from: number, to: number) {
		if (!tool || tool.category !== 'webapp') return;
		if (to < 0 || to >= tool.screenshots.length) return;
		const arr = [...tool.screenshots];
		const [item] = arr.splice(from, 1);
		arr.splice(to, 0, item);
		tool.screenshots = arr;
	}

	// UsedBy
	function addUsedBy() {
		if (!tool || tool.category !== 'library') return;
		if (!editingUsedBy.entry.title.trim() || !editingUsedBy.entry.url.trim()) return;
		const arr = [...tool.usedBy];
		if (editingUsedBy.idx !== null) {
			arr[editingUsedBy.idx] = { ...editingUsedBy.entry };
		} else {
			arr.push({ ...editingUsedBy.entry });
		}
		tool.usedBy = arr;
		editingUsedBy = { idx: null, entry: { title: '', url: '' } };
	}

	function removeUsedBy(idx: number) {
		if (!tool || tool.category !== 'library') return;
		tool.usedBy = tool.usedBy.filter(
			(_: { title: string; url: string }, i: number) => i !== idx
		);
	}

	function moveUsedBy(from: number, to: number) {
		if (!tool || tool.category !== 'library') return;
		if (to < 0 || to >= tool.usedBy.length) return;
		const arr = [...tool.usedBy];
		const [item] = arr.splice(from, 1);
		arr.splice(to, 0, item);
		tool.usedBy = arr;
	}

	// Tool FAQs
	function addToolFaq() {
		if (!tool) return;
		const id = `faq-${Date.now()}`;
		const entry = { id, i18n: { ja: {}, en: {} } };
		tool.faqs = [...tool.faqs, entry];
		editingToolFaq = { idx: null, entry };
	}

	function removeToolFaq(idx: number) {
		if (!tool) return;
		const arr = [...tool.faqs];
		arr.splice(idx, 1);
		tool.faqs = arr;
		if (editingToolFaq.entry.id === arr[idx]?.id) {
			editingToolFaq = { idx: null, entry: { id: '', i18n: { ja: {}, en: {} } } };
		}
	}

	function moveToolFaq(from: number, to: number) {
		if (!tool) return;
		if (to < 0 || to >= tool.faqs.length) return;
		const arr = [...tool.faqs];
		const [item] = arr.splice(from, 1);
		arr.splice(to, 0, item);
		tool.faqs = arr;
	}

	function saveToolFaq() {
		if (!tool || !editingToolFaq.entry.id) return;
		const arr = [...tool.faqs];
		if (editingToolFaq.idx !== null) {
			arr[editingToolFaq.idx] = { ...editingToolFaq.entry };
		} else {
			arr.push({ ...editingToolFaq.entry });
		}
		tool.faqs = arr;
		editingToolFaq = { idx: null, entry: { id: '', i18n: { ja: {}, en: {} } } };
	}

	// Related Links
	function addRelatedLink() {
		if (!tool) return;
		const arr = [...tool.relatedLinks, { type: '', url: '', toolId: '' }];
		tool.relatedLinks = arr;
		editingRelatedLink = { idx: arr.length - 1, entry: { type: '', url: '', toolId: '' } };
	}

	function removeRelatedLink(idx: number) {
		if (!tool) return;
		tool.relatedLinks = tool.relatedLinks.filter((_: unknown, i: number) => i !== idx);
	}

	function moveRelatedLinks(from: number, to: number) {
		if (!tool) return;
		if (to < 0 || to >= tool.relatedLinks.length) return;
		const arr = [...tool.relatedLinks];
		const [item] = arr.splice(from, 1);
		arr.splice(to, 0, item);
		tool.relatedLinks = arr;
	}

	function saveRelatedLinkEntry() {
		if (!tool || editingRelatedLink.idx === null) return;
		tool.relatedLinks = tool.relatedLinks.map(
			(item: { type: string; url?: string; toolId?: string }, i: number) =>
				i === editingRelatedLink.idx ? { ...editingRelatedLink.entry } : item
		);
		editingRelatedLink = { idx: null, entry: { type: '', url: '', toolId: '' } };
	}

	// WhatsNew
	function addWhatsNew(lang: 'ja' | 'en') {
		if (!tool) return;
		const i18nEntry = tool.i18n[lang];
		const arr = [...(i18nEntry.whatsNew as WhatsNewEntry[]), { date: '', title: '' }];
		i18nEntry.whatsNew = arr;
		editingWhatsNew = { lang, idx: arr.length - 1, entry: { date: '', title: '' } };
	}

	function removeWhatsNew(lang: 'ja' | 'en', idx: number) {
		if (!tool) return;
		const i18nEntry = tool.i18n[lang];
		i18nEntry.whatsNew = (i18nEntry.whatsNew as WhatsNewEntry[]).filter(
			(_: unknown, i: number) => i !== idx
		);
	}

	function saveWhatsNewEntry() {
		if (!tool || !editingWhatsNew.lang || editingWhatsNew.idx === null) return;
		const i18nEntry = tool.i18n[editingWhatsNew.lang];
		i18nEntry.whatsNew = (i18nEntry.whatsNew as WhatsNewEntry[]).map(
			(item: WhatsNewEntry, i: number) =>
				i === editingWhatsNew.idx ? { ...editingWhatsNew.entry } : item
		);
		editingWhatsNew = { lang: null, idx: null, entry: { date: '', title: '' } };
	}

	function save() {
		return tool;
	}

	return {
		tool,
		setTool,
		updateField,
		editingScreenshot,
		setEditingScreenshot: (v: typeof editingScreenshot) => { editingScreenshot = v; },
		editingInlineScreenshotIdx,
		inlineScreenshotValue,
		setInlineScreenshotValue: (v: string) => { inlineScreenshotValue = v; },
		addScreenshot,
		startEditInlineScreenshot,
		saveInlineScreenshot,
		cancelEditInlineScreenshot,
		removeScreenshot,
		moveScreenshot,
		editingUsedBy,
		setEditingUsedBy: (v: typeof editingUsedBy) => { editingUsedBy = v; },
		addUsedBy,
		removeUsedBy,
		moveUsedBy,
		editingToolFaq,
		setEditingToolFaq: (v: typeof editingToolFaq) => { editingToolFaq = v; },
		addToolFaq,
		removeToolFaq,
		moveToolFaq,
		saveToolFaq,
		editingRelatedLink,
		setEditingRelatedLink: (v: typeof editingRelatedLink) => { editingRelatedLink = v; },
		addRelatedLink,
		removeRelatedLink,
		moveRelatedLinks,
		saveRelatedLinkEntry,
		editingWhatsNew,
		setEditingWhatsNew: (v: typeof editingWhatsNew) => { editingWhatsNew = v; },
		addWhatsNew,
		removeWhatsNew,
		saveWhatsNewEntry,
		save
	};
}
