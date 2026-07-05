<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Select, SelectContent, SelectItem, SelectTrigger } from '$lib/components/ui/select';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import MoveButtons from './MoveButtons.svelte';
	import EditPanel from './EditPanel.svelte';
	import InlineArrayEditor from './InlineArrayEditor.svelte';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import {
		Plus,
		Trash2,
		Pencil,
		Code2,
		Table as TableIcon,
		Save,
		X,
		ChevronDown,
		ChevronRight,
		RefreshCw,
		FileJson,
		AlertCircle
	} from '@lucide/svelte';
	import type { RelatedLink } from '$lib/types';

	interface Props {
		file: string;
		data: unknown;
		onsave?: () => void;
	}

	let { file, data, onsave }: Props = $props();

	type ViewMode = 'structured' | 'raw';
	let viewMode: ViewMode = $state('structured');
	let rawText = $state('');
	let saveStatus: 'idle' | 'saving' | 'saved' | 'error' = $state('idle');
	let error = $state<string | null>(null);
	let localData = $state(data);

	$effect(() => {
		localData = data;
	});

	$effect(() => {
		rawText = JSON.stringify(data, null, '\t');
	});

	function save() {
		saveStatus = 'saving';
		error = null;
		try {
			if (viewMode === 'raw') {
				JSON.parse(rawText);
			}
			fetch(`/gui/api?file=${file}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ file, data: viewMode === 'raw' ? JSON.parse(rawText) : localData })
			})
				.then((res) => res.json())
				.then((result) => {
					if (result.ok) {
						saveStatus = 'saved';
						onsave?.();
						setTimeout(() => (saveStatus = 'idle'), 2000);
					} else {
						saveStatus = 'error';
						error = result.error;
					}
				})
				.catch(() => {
					saveStatus = 'error';
					error = 'Failed to save';
				});
		} catch {
			saveStatus = 'error';
			error = 'Invalid JSON in raw editor';
		}
	}

	// --- Feature entry helpers ---
	let addingFeature = $state(false);
	let newFeatureValue = $state('');

	function addFeature() {
		if (!newFeatureValue.trim()) return;
		(localData as string[]) = [...(localData as string[]), newFeatureValue.trim()];
		newFeatureValue = '';
		addingFeature = false;
	}

	function removeFeature(idx: number) {
		(localData as string[]) = (localData as string[]).filter((_: string, i: number) => i !== idx);
	}

	function moveFeature(from: number, to: number) {
		if (to < 0 || to >= (localData as string[]).length) return;
		const arr = [...(localData as string[])];
		const [item] = arr.splice(from, 1);
		arr.splice(to, 0, item);
		(localData as string[]) = arr;
	}

	// --- FAQ helpers ---
	type FaqEntry = {
		id: string;
		i18n: { ja: { question: string; answer: string }; en: { question: string; answer: string } };
	};
	let faqExpanded = $state<Set<number>>(new Set());
	let editingFaq = $state<{ idx: number | null; entry: FaqEntry | null }>({
		idx: null,
		entry: null
	});

	function addFaq() {
		const id = `faq-${Date.now()}`;
		(localData as FaqEntry[]) = [
			...(localData as FaqEntry[]),
			{
				id,
				i18n: {
					ja: { question: '', answer: '' },
					en: { question: '', answer: '' }
				}
			}
		];
	}

	function removeFaq(idx: number) {
		(localData as FaqEntry[]) = (localData as FaqEntry[]).filter(
			(_: FaqEntry, i: number) => i !== idx
		);
	}

	function moveFaq(from: number, to: number) {
		if (to < 0 || to >= (localData as FaqEntry[]).length) return;
		const arr = [...(localData as FaqEntry[])];
		const [item] = arr.splice(from, 1);
		arr.splice(to, 0, item);
		(localData as FaqEntry[]) = arr;
	}

	function toggleFaqExpand(idx: number) {
		const next = new Set(faqExpanded);
		if (next.has(idx)) next.delete(idx);
		else next.add(idx);
		faqExpanded = next;
	}

	function saveFaqEntry(entry: FaqEntry) {
		if (editingFaq.idx !== null) {
			(localData as FaqEntry[]) = (localData as FaqEntry[]).map((item, i) =>
				i === editingFaq.idx ? entry : item
			);
		} else {
			(localData as FaqEntry[]) = [...(localData as FaqEntry[]), entry];
		}
		editingFaq = { idx: null, entry: null };
	}

	// --- Needs helpers ---
	type NeedEntry = {
		id: string;
		icon: string;
		i18n: { ja: { title: string }; en: { title: string } };
		toolList: string[];
	};
	let editingNeed = $state<{ idx: number | null; entry: NeedEntry | null }>({
		idx: null,
		entry: null
	});
	let toolIdInput = $state('');

	function addNeed() {
		const id = `need-${Date.now()}`;
		(localData as NeedEntry[]) = [
			...(localData as NeedEntry[]),
			{
				id,
				icon: 'Star',
				i18n: { ja: { title: '' }, en: { title: '' } },
				toolList: []
			}
		];
	}

	function removeNeed(idx: number) {
		(localData as NeedEntry[]) = (localData as NeedEntry[]).filter(
			(_: NeedEntry, i: number) => i !== idx
		);
	}

	function moveNeed(from: number, to: number) {
		if (to < 0 || to >= (localData as NeedEntry[]).length) return;
		const arr = [...(localData as NeedEntry[])];
		const [item] = arr.splice(from, 1);
		arr.splice(to, 0, item);
		(localData as NeedEntry[]) = arr;
	}

	function saveNeedEntry(entry: NeedEntry) {
		if (editingNeed.idx !== null) {
			(localData as NeedEntry[]) = (localData as NeedEntry[]).map((item, i) =>
				i === editingNeed.idx ? entry : item
			);
		} else {
			(localData as NeedEntry[]) = [...(localData as NeedEntry[]), entry];
		}
		editingNeed = { idx: null, entry: null };
	}

	function addToolToNeed(idx: number, toolId: string) {
		if (!toolId.trim()) return;
		const entry = (localData as NeedEntry[])[idx];
		if (entry.toolList.includes(toolId.trim())) return;
		const updated = { ...entry, toolList: [...entry.toolList, toolId.trim()] };
		(localData as NeedEntry[]) = (localData as NeedEntry[]).map((item, i) =>
			i === idx ? updated : item
		);
		toolIdInput = '';
	}

	function removeToolFromNeed(idx: number, toolId: string) {
		const entry = (localData as NeedEntry[])[idx];
		const updated = { ...entry, toolList: entry.toolList.filter((t) => t !== toolId) };
		(localData as NeedEntry[]) = (localData as NeedEntry[]).map((item, i) =>
			i === idx ? updated : item
		);
	}

	function moveToolInNeed(needIdx: number, from: number, to: number) {
		const entry = (localData as NeedEntry[])[needIdx];
		if (to < 0 || to >= entry.toolList.length) return;
		const arr = [...entry.toolList];
		const [item] = arr.splice(from, 1);
		arr.splice(to, 0, item);
		(localData as NeedEntry[]) = (localData as NeedEntry[]).map((item, i) =>
			i === needIdx ? { ...item, toolList: arr } : item
		);
	}

	// --- Tools helpers ---
	type ToolFaq = { id: string; i18n: Record<string, { question?: string; answer?: string }> };
	type WebappTool = {
		category: 'webapp';
		audience: string;
		websiteUrl: string;
		icon: string;
		screenshots: string[];
		relatedLinks: { type: string; url?: string; toolId?: string }[];
		faqs: ToolFaq[];
		i18n: Record<
			string,
			{
				name: string;
				description: string;
				tagline: string;
				highlights: string;
				whatsNew: { date: string; title: string }[];
			}
		>;
	};
	type LibraryTool = {
		category: 'library';
		audience: string;
		websiteUrl: string;
		icon: string;
		usedBy: { title: string; author?: string; url: string }[];
		relatedLinks: { type: string; url?: string; toolId?: string }[];
		faqs: ToolFaq[];
		i18n: Record<
			string,
			{
				name: string;
				description: string;
				tagline: string;
				highlights: string;
				whatsNew: { date: string; title: string }[];
			}
		>;
	};
	type ExtensionTool = {
		category: 'extension';
		audience: string;
		websiteUrl: string;
		icon: string;
		screenshots: string[];
		relatedLinks: { type: string; url?: string; toolId?: string }[];
		faqs: ToolFaq[];
		i18n: Record<
			string,
			{
				name: string;
				description: string;
				tagline: string;
				highlights: string;
				whatsNew: { date: string; title: string }[];
			}
		>;
	};
	type Tool = WebappTool | LibraryTool | ExtensionTool;
	type ToolsMap = Record<string, Tool>;
	let editingKey = $state<string | null>(null);
	let editingTool = $state<Tool | null>(null);
	let newToolKey = $state('');
	let editingScreenshot = $state<{ idx: number; url: string } | null>(null);
	let editingInlineScreenshotIdx = $state<number | null>(null);
	let inlineScreenshotValue = $state('');

	function addTool() {
		if (!newToolKey.trim()) return;
		if ((localData as ToolsMap)[newToolKey.trim()]) return;
		const tool: Tool = {
			category: 'webapp',
			audience: 'enduser',
			websiteUrl: '',
			icon: '',
			screenshots: [],
			relatedLinks: [],
			faqs: [{ id: '', i18n: { ja: {}, en: {} } }],
			i18n: {
				ja: {
					name: newToolKey.trim(),
					description: '',
					tagline: '',
					highlights: '',
					whatsNew: []
				}
			}
		};
		localData = { ...(localData as ToolsMap), [newToolKey.trim()]: tool };
		newToolKey = '';
	}

	function removeTool(key: string) {
		const copy = { ...(localData as ToolsMap) };
		delete copy[key];
		localData = copy;
		if (editingKey === key) {
			editingKey = null;
			editingTool = null;
		}
	}

	function openToolEditor(key: string) {
		editingKey = key;
		editingTool = deepClone((localData as ToolsMap)[key]);
	}

	function saveTool() {
		if (!editingTool) return;
		localData = { ...(localData as ToolsMap), [editingKey!]: editingTool };
		editingKey = null;
		editingTool = null;
	}

	function cancelToolEditor() {
		editingKey = null;
		editingTool = null;
	}

	// Screenshots helpers
	function addScreenshot() {
		if (!editingTool || editingTool.category !== 'webapp' || !editingScreenshot) return;
		if (!editingScreenshot.url.trim()) return;
		editingTool.screenshots = [...editingTool.screenshots, editingScreenshot.url.trim()];
		editingScreenshot = { idx: -1, url: '' };
	}

	function startEditInlineScreenshot(idx: number) {
		if (!editingTool || editingTool.category !== 'webapp') return;
		editingInlineScreenshotIdx = idx;
		inlineScreenshotValue = editingTool.screenshots[idx];
	}

	function saveInlineScreenshot() {
		if (
			!editingTool ||
			editingTool.category !== 'webapp' ||
			editingInlineScreenshotIdx === null ||
			!inlineScreenshotValue.trim()
		)
			return;
		editingTool.screenshots = [
			...editingTool.screenshots.slice(0, editingInlineScreenshotIdx),
			inlineScreenshotValue.trim(),
			...editingTool.screenshots.slice(editingInlineScreenshotIdx + 1)
		];
		editingInlineScreenshotIdx = null;
		inlineScreenshotValue = '';
	}

	function cancelEditInlineScreenshot() {
		editingInlineScreenshotIdx = null;
		inlineScreenshotValue = '';
	}

	function removeScreenshot(idx: number) {
		if (!editingTool || editingTool.category !== 'webapp') return;
		editingTool.screenshots = editingTool.screenshots.filter((_: string, i: number) => i !== idx);
	}

	function moveScreenshot(from: number, to: number) {
		if (!editingTool || editingTool.category !== 'webapp') return;
		if (to < 0 || to >= editingTool.screenshots.length) return;
		const arr = [...editingTool.screenshots];
		const [item] = arr.splice(from, 1);
		arr.splice(to, 0, item);
		editingTool.screenshots = arr;
	}

	// UsedBy helpers
	let editingUsedBy = $state<{
		idx: number | null;
		entry: { title: string; author?: string; url: string };
	}>({
		idx: null,
		entry: { title: '', url: '' }
	});

	function addUsedBy() {
		if (!editingTool || editingTool.category !== 'library') return;
		if (!editingUsedBy.entry.title.trim() || !editingUsedBy.entry.url.trim()) return;
		const arr = [...editingTool.usedBy];
		if (editingUsedBy.idx !== null) {
			arr[editingUsedBy.idx] = { ...editingUsedBy.entry };
		} else {
			arr.push({ ...editingUsedBy.entry });
		}
		editingTool.usedBy = arr;
		editingUsedBy = { idx: null, entry: { title: '', url: '' } };
	}

	function removeUsedBy(idx: number) {
		if (!editingTool || editingTool.category !== 'library') return;
		editingTool.usedBy = editingTool.usedBy.filter(
			(_: { title: string; url: string }, i: number) => i !== idx
		);
	}

	function moveUsedBy(from: number, to: number) {
		if (!editingTool || editingTool.category !== 'library') return;
		if (to < 0 || to >= editingTool.usedBy.length) return;
		const arr = [...editingTool.usedBy];
		const [item] = arr.splice(from, 1);
		arr.splice(to, 0, item);
		editingTool.usedBy = arr;
	}

	// Tool FAQ helpers
	let editingToolFaq = $state<{
		idx: number | null;
		entry: { id: string; i18n: Record<string, { question?: string; answer?: string }> };
	}>({
		idx: null,
		entry: { id: '', i18n: { ja: {}, en: {} } }
	});

	function addToolFaq() {
		if (!editingTool) return;
		const id = `faq-${Date.now()}`;
		const entry = { id, i18n: { ja: {}, en: {} } };
		const arr = [...editingTool.faqs, entry];
		editingTool.faqs = arr;
		editingToolFaq = { idx: null, entry };
	}

	function removeToolFaq(idx: number) {
		if (!editingTool) return;
		const arr = [...editingTool.faqs];
		arr.splice(idx, 1);
		editingTool.faqs = arr;
		if (editingToolFaq.entry.id === arr[idx]?.id) {
			editingToolFaq = { idx: null, entry: { id: '', i18n: { ja: {}, en: {} } } };
		}
	}

	function moveToolFaq(from: number, to: number) {
		if (!editingTool) return;
		if (to < 0 || to >= editingTool.faqs.length) return;
		const arr = [...editingTool.faqs];
		const [item] = arr.splice(from, 1);
		arr.splice(to, 0, item);
		editingTool.faqs = arr;
	}

	function moveRelatedLinks(from: number, to: number) {
		if (!editingTool) return;
		if (to < 0 || to >= editingTool.relatedLinks.length) return;
		const arr = [...editingTool.relatedLinks];
		const [item] = arr.splice(from, 1);
		arr.splice(to, 0, item);
		editingTool.relatedLinks = arr;
	}

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

	// RelatedLinks helpers
	let editingRelatedLink = $state<{
		idx: number | null;
		entry: { type: string; url?: string; toolId?: string };
	}>({
		idx: null,
		entry: { type: '', url: '', toolId: '' }
	});

	function addRelatedLink() {
		if (!editingTool) return;
		const arr = [...editingTool.relatedLinks, { type: '', url: '', toolId: '' }];
		editingTool.relatedLinks = arr;
		editingRelatedLink = { idx: arr.length - 1, entry: { type: '', url: '', toolId: '' } };
	}

	function removeRelatedLink(idx: number) {
		if (!editingTool) return;
		editingTool.relatedLinks = editingTool.relatedLinks.filter(
			(_: unknown, i: number) => i !== idx
		);
	}

	function saveRelatedLinkEntry() {
		if (!editingTool || editingRelatedLink.idx === null) return;
		type RLink = { type: string; url?: string; toolId?: string };
		editingTool.relatedLinks = (editingTool.relatedLinks as RLink[]).map(
			(item: RLink, i: number) =>
				i === editingRelatedLink.idx ? { ...editingRelatedLink.entry } : item
		);
		editingRelatedLink = { idx: null, entry: { type: '', url: '', toolId: '' } };
	}

	// WhatsNew helpers
	type WhatsNewEntry = { date: string; title: string };
	let editingWhatsNew = $state<{
		lang: 'ja' | 'en' | null;
		idx: number | null;
		entry: WhatsNewEntry;
	}>({
		lang: null,
		idx: null,
		entry: { date: '', title: '' }
	});

	function addWhatsNew(lang: 'ja' | 'en') {
		if (!editingTool) return;
		const i18nEntry = editingTool.i18n[lang];
		const arr = [...(i18nEntry.whatsNew as WhatsNewEntry[]), { date: '', title: '' }];
		i18nEntry.whatsNew = arr;
		editingWhatsNew = { lang, idx: arr.length - 1, entry: { date: '', title: '' } };
	}

	function removeWhatsNew(lang: 'ja' | 'en', idx: number) {
		if (!editingTool) return;
		const i18nEntry = editingTool.i18n[lang];
		i18nEntry.whatsNew = (i18nEntry.whatsNew as WhatsNewEntry[]).filter(
			(_: unknown, i: number) => i !== idx
		);
	}

	function saveWhatsNewEntry() {
		if (!editingTool || !editingWhatsNew.lang || editingWhatsNew.idx === null) return;
		const i18nEntry = editingTool.i18n[editingWhatsNew.lang];
		i18nEntry.whatsNew = (i18nEntry.whatsNew as WhatsNewEntry[]).map(
			(item: WhatsNewEntry, i: number) =>
				i === editingWhatsNew.idx ? { ...editingWhatsNew.entry } : item
		);
		editingWhatsNew = { lang: null, idx: null, entry: { date: '', title: '' } };
	}

	function saveToolFaq() {
		if (!editingTool || !editingToolFaq.entry.id) return;
		const arr = [...editingTool.faqs];
		if (editingToolFaq.idx !== null) {
			arr[editingToolFaq.idx] = { ...editingToolFaq.entry };
		} else {
			arr.push({ ...editingToolFaq.entry });
		}
		editingTool.faqs = arr;
		editingToolFaq = { idx: null, entry: { id: '', i18n: { ja: {}, en: {} } } };
	}

	function refreshData() {
		fetch(`/gui/api?file=${file}`)
			.then((r) => r.json())
			.then((result) => {
				$effect(() => {});
			})
			.catch(() => {});
	}
</script>

<Card class="w-full">
	<CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
		<CardTitle class="flex items-center gap-2 text-xl">
			<FileJson class="h-5 w-5" />
			<span class="font-mono">{file}</span>
		</CardTitle>
		<div class="flex items-center gap-2">
			<Button variant="outline" size="sm" onclick={refreshData}>
				<RefreshCw class="h-4 w-4" />
			</Button>
			<Button
				variant={viewMode === 'structured' ? 'default' : 'outline'}
				size="sm"
				onclick={() => (viewMode = 'structured')}
			>
				<TableIcon class="h-4 w-4 mr-1" />Structured
			</Button>
			<Button
				variant={viewMode === 'raw' ? 'default' : 'outline'}
				size="sm"
				onclick={() => (viewMode = 'raw')}
			>
				<Code2 class="h-4 w-4 mr-1" />Raw JSON
			</Button>
			<Button size="sm" onclick={save} disabled={saveStatus === 'saving'}>
				{#if saveStatus === 'saving'}
					<RefreshCw class="h-4 w-4 animate-spin" /> Saving...
				{:else}
					<Save class="h-4 w-4" /> Save
				{/if}
			</Button>
		</div>
	</CardHeader>

	<Separator />

	<CardContent class="pt-6">
		{#if error}
			<div class="flex items-center gap-2 text-red-500 mb-4 p-3 bg-red-50 rounded">
				<AlertCircle class="h-4 w-4" />
				<span>{error}</span>
			</div>
		{/if}

		{#if saveStatus === 'saved'}
			<div class="flex items-center gap-2 text-green-500 mb-4 p-3 bg-green-50 rounded">
				<Save class="h-4 w-4" />
				Saved successfully!
			</div>
		{/if}

		{#if viewMode === 'structured'}
			{#if file === 'features.json'}
				<!-- Features: Simple string array -->
				<InlineArrayEditor
					items={localData as string[]}
					onAdd={() => (addingFeature = true)}
					onRemove={removeFeature}
					onEdit={() => {}}
					onMove={moveFeature}
					itemLabel="Features"
				>
					<svelte:fragment slot="item" let:item let:idx>
						<span class="font-mono">{item}</span>
					</svelte:fragment>
				</InlineArrayEditor>
				{#if addingFeature}
					<div class="flex gap-2 items-center mt-2">
						<Input
							bind:value={newFeatureValue}
							placeholder="feature-id"
							onkeydown={(e) => e.key === 'Enter' && addFeature()}
							class="font-mono"
						/>
						<Button size="sm" onclick={addFeature}>Add</Button>
						<Button
							size="sm"
							variant="outline"
							onclick={() => {
								addingFeature = false;
								newFeatureValue = '';
							}}>Cancel</Button
						>
					</div>
				{/if}
			{:else if file === 'faq.json'}
				<!-- FAQ: Array of entries with i18n -->
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead class="w-12"></TableHead>
							<TableHead>ID</TableHead>
							<TableHead>JA Question</TableHead>
							<TableHead>EN Question</TableHead>
							<TableHead class="w-24">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{#if true}
							{@const faqList = localData as FaqEntry[]}
							{#each faqList as faq, i}
								<TableRow class="cursor-pointer" onclick={() => toggleFaqExpand(i)}>
									<TableCell>
										{#if faqExpanded.has(i)}
											<ChevronDown class="h-4 w-4" />
										{:else}
											<ChevronRight class="h-4 w-4" />
										{/if}
									</TableCell>
									<TableCell class="font-mono text-sm">{faq.id}</TableCell>
									<TableCell
										>{faq.i18n.ja.question.substring(0, 40)}{faq.i18n.ja.question.length > 40
											? '...'
											: ''}</TableCell
									>
									<TableCell
										>{faq.i18n.en.question.substring(0, 40)}{faq.i18n.en.question.length > 40
											? '...'
											: ''}</TableCell
									>
									<TableCell>
										<div class="flex gap-1">
											<MoveButtons
												onUp={() => {
													faqExpanded.delete(i);
													moveFaq(i, i - 1);
												}}
												onDown={() => {
													faqExpanded.delete(i);
													moveFaq(i, i + 1);
												}}
												disabledUp={i === 0}
												disabledDown={i === faqList.length - 1}
											/>
											<Button
												variant="ghost"
												size="icon"
												onclick={(e) => {
													e.stopPropagation();
													editingFaq = { idx: i, entry: { ...faq } };
												}}
											>
												<Pencil class="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												onclick={(e) => {
													e.stopPropagation();
													removeFaq(i);
												}}
											>
												<Trash2 class="h-4 w-4 text-red-500" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
								{#if faqExpanded.has(i)}
									<TableRow>
										<TableCell colspan={5} class="p-4">
											<div class="grid grid-cols-2 gap-4 text-sm">
												<div>
													<Label class="font-bold mb-1 block">Japanese</Label>
													<Label class="text-xs text-muted-foreground mb-1 block">Question</Label>
													<Textarea bind:value={faq.i18n.ja.question} rows={2} class="mb-2" />
													<Label class="text-xs text-muted-foreground mb-1 block">Answer</Label>
													<Textarea bind:value={faq.i18n.ja.answer} rows={4} />
												</div>
												<div>
													<Label class="font-bold mb-1 block">English</Label>
													<Label class="text-xs text-muted-foreground mb-1 block">Question</Label>
													<Textarea bind:value={faq.i18n.en.question} rows={2} class="mb-2" />
													<Label class="text-xs text-muted-foreground mb-1 block">Answer</Label>
													<Textarea bind:value={faq.i18n.en.answer} rows={4} />
												</div>
											</div>
										</TableCell>
									</TableRow>
								{/if}
							{/each}
						{/if}
					</TableBody>
				</Table>
				<Separator class="my-4" />
				<Button variant="outline" size="sm" onclick={addFaq}>
					<Plus class="h-4 w-4 mr-1" /> Add FAQ
				</Button>

				{#if editingFaq.entry}
					<Separator class="my-4" />
					<div class="bg-muted/50 p-4 rounded-lg space-y-4 shadow">
						<div class="flex items-center justify-between">
							<span class="font-bold">Edit FAQ Entry</span>
							<Button
								variant="ghost"
								size="icon"
								onclick={() => (editingFaq = { idx: null, entry: null })}
							>
								<X class="h-4 w-4" />
							</Button>
						</div>
						<div>
							<Label class="mb-1 block">ID</Label>
							<Input bind:value={editingFaq.entry!.id} class="font-mono" />
						</div>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<Label class="font-bold mb-2 block">Japanese</Label>
								<Label class="text-xs mb-1 block">Question</Label>
								<Textarea bind:value={editingFaq.entry!.i18n.ja.question} rows={2} class="mb-2" />
								<Label class="text-xs mb-1 block">Answer</Label>
								<Textarea bind:value={editingFaq.entry!.i18n.ja.answer} rows={3} />
							</div>
							<div>
								<Label class="font-bold mb-2 block">English</Label>
								<Label class="text-xs mb-1 block">Question</Label>
								<Textarea bind:value={editingFaq.entry!.i18n.en.question} rows={2} class="mb-2" />
								<Label class="text-xs mb-1 block">Answer</Label>
								<Textarea bind:value={editingFaq.entry!.i18n.en.answer} rows={3} />
							</div>
						</div>
						<div class="flex gap-2 justify-end">
							<Button variant="outline" onclick={() => (editingFaq = { idx: null, entry: null })}
								>Cancel</Button
							>
							<Button onclick={() => saveFaqEntry(editingFaq.entry!)}>Save</Button>
						</div>
					</div>
				{/if}
			{:else if file === 'needs.json'}
				<!-- Needs: Array of entries with toolList -->
				{#if true}
					{@const needsList = localData as NeedEntry[]}
					<div class="space-y-4">
						{#each needsList as need, i}
							<Card class="relative">
								<CardHeader class="pb-3">
									<div class="flex items-center justify-between">
										<CardTitle class="text-base flex items-center gap-2">
											<span class="font-mono text-sm bg-muted px-2 py-0.5 rounded">{need.id}</span>
											<span>{need.i18n.ja.title}</span>
										</CardTitle>
										<div class="flex gap-1">
											<MoveButtons
												onUp={() => moveNeed(i, i - 1)}
												onDown={() => moveNeed(i, i + 1)}
												disabledUp={i === 0}
												disabledDown={i === needsList.length - 1}
											/>
											<Button
												variant="ghost"
												size="icon"
												onclick={() => (editingNeed = { idx: i, entry: { ...need } })}
											>
												<Pencil class="h-4 w-4" />
											</Button>
											<Button variant="ghost" size="icon" onclick={() => removeNeed(i)}>
												<Trash2 class="h-4 w-4 text-red-500" />
											</Button>
										</div>
									</div>
								</CardHeader>
								<CardContent class="pb-3">
									<Label class="text-xs mb-1 block">Associated Tools</Label>
									<div class="flex flex-wrap gap-1 mb-2">
										{#each need.toolList as tool, tIdx}
											<span
												class="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm font-mono"
											>
												<span class="flex gap-0.5">
													<button
														class="hover:text-blue-500 disabled:opacity-30"
														onclick={() => moveToolInNeed(i, tIdx, tIdx - 1)}
														disabled={tIdx === 0}
														title="Move up">↑</button
													>
													<button
														class="hover:text-blue-500 disabled:opacity-30"
														onclick={() => moveToolInNeed(i, tIdx, tIdx + 1)}
														disabled={tIdx === need.toolList.length - 1}
														title="Move down">↓</button
													>
												</span>
												{tool}
												<button
													onclick={() => removeToolFromNeed(i, tool)}
													class="hover:text-red-500">&times;</button
												>
											</span>
										{/each}
									</div>
									<div class="flex gap-2">
										<Input
											bind:value={toolIdInput}
											placeholder="tool-id"
											class="font-mono text-sm h-8"
											onkeydown={(e) => e.key === 'Enter' && addToolToNeed(i, toolIdInput)}
										/>
										<Button
											size="sm"
											variant="outline"
											onclick={() => addToolToNeed(i, toolIdInput)}>Add tool</Button
										>
									</div>
								</CardContent>
							</Card>
						{/each}
					</div>
				{/if}
				<Separator class="my-4" />
				<Button variant="outline" size="sm" onclick={addNeed}>
					<Plus class="h-4 w-4 mr-1" /> Add Need Category
				</Button>

				{#if editingNeed.entry}
					<Separator class="my-4" />
					<div class="bg-muted/50 p-4 rounded-lg space-y-4 shadow">
						<div class="flex items-center justify-between">
							<span class="font-bold">Edit Need Entry</span>
							<Button
								variant="ghost"
								size="icon"
								onclick={() => (editingNeed = { idx: null, entry: null })}
							>
								<X class="h-4 w-4" />
							</Button>
						</div>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<Label>ID</Label>
								<Input bind:value={editingNeed.entry!.id} class="font-mono" />
							</div>
							<div>
								<Label>Icon (Lucide name)</Label>
								<Input bind:value={editingNeed.entry!.icon} />
							</div>
						</div>
						<div class="grid grid-cols-2 gap-4">
							<div>
								<Label class="font-bold">Japanese</Label>
								<Input bind:value={editingNeed.entry!.i18n.ja.title} class="mt-1" />
							</div>
							<div>
								<Label class="font-bold">English</Label>
								<Input bind:value={editingNeed.entry!.i18n.en.title} class="mt-1" />
							</div>
						</div>
						<div class="flex gap-2 justify-end">
							<Button variant="outline" onclick={() => (editingNeed = { idx: null, entry: null })}
								>Cancel</Button
							>
							<Button onclick={() => saveNeedEntry(editingNeed.entry!)}>Save</Button>
						</div>
					</div>
				{/if}
			{:else if file === 'tools.json'}
				<!-- Tools: Key-value object -->
				<div class="space-y-4">
					{#if editingKey && editingTool}
						<!-- Tool editor form -->
						<div class="bg-muted/50 p-4 rounded-lg space-y-4 shadow">
							<div class="flex items-center justify-between">
								<span class="font-bold">Edit Tool: <span class="font-mono">{editingKey}</span></span
								>
								<Button variant="ghost" size="icon" onclick={cancelToolEditor}>
									<X class="h-4 w-4" />
								</Button>
							</div>
							<div class="grid grid-cols-2 gap-4">
								<div>
									<Label>Category</Label>
									<select
										oninput={(e) => {
											const v = (e.target as HTMLSelectElement).value;
											if (v === 'webapp' || v === 'library' || v === 'extension')
												editingTool!.category = v as any;
										}}
									>
										<option value="webapp" selected={editingTool!.category === 'webapp'}
											>webapp</option
										>
										<option value="library" selected={editingTool!.category === 'library'}
											>library</option
										>
										<option value="extension" selected={editingTool!.category === 'extension'}
											>extension</option
										>
									</select>
								</div>
								<div>
									<Label>Audience</Label>
									<select
										oninput={(e) => {
											editingTool!.audience = (e.target as HTMLSelectElement).value;
										}}
									>
										<option value="enduser" selected={editingTool!.audience === 'enduser'}
											>enduser</option
										>
										<option value="developer" selected={editingTool!.audience === 'developer'}
											>developer</option
										>
									</select>
								</div>
								<div>
									<Label>Website URL</Label>
									<Input bind:value={editingTool!.websiteUrl} />
								</div>
								<div>
									<Label>Icon URL</Label>
									<Input bind:value={editingTool!.icon} />
								</div>
							</div>
							<Separator />
							<div>
								<Label class="font-bold mb-2 block">Japanese Content</Label>
								<div class="space-y-2">
									<Input bind:value={editingTool.i18n.ja.name} placeholder="Name" />
									<Input bind:value={editingTool.i18n.ja.description} placeholder="Description" />
									<Input bind:value={editingTool.i18n.ja.tagline} placeholder="Tagline" />
									<Textarea
										bind:value={editingTool.i18n.ja.highlights}
										placeholder="Highlights (Markdown)"
										rows={3}
									/>
								</div>
							</div>
							<div>
								<Label class="font-bold mb-2 block">WhatsNew (JA)</Label>
								{#if editingTool.i18n.ja.whatsNew}
									{#each editingTool.i18n.ja.whatsNew as entry, idx}
										<div class="flex gap-2 items-center mb-1">
											<Input
												bind:value={entry.date}
												placeholder="Date"
												class="font-mono text-sm h-8 flex-1"
											/>
											<Input
												bind:value={entry.title}
												placeholder="Title"
												class="font-mono text-sm h-8 flex-2"
											/>
											<Button
												variant="ghost"
												size="icon"
												class="h-8 w-8 shrink-0"
												onclick={() => removeWhatsNew('ja', idx)}
											>
												<Trash2 class="h-3 w-3 text-red-500" />
											</Button>
										</div>
									{/each}
								{/if}
								<Button variant="outline" size="sm" onclick={() => addWhatsNew('ja')}>
									<Plus class="h-3 w-3 mr-1" /> Add
								</Button>
								{#if editingWhatsNew.lang === 'ja' && editingWhatsNew.entry.title !== ''}
									<EditPanel
										title="Edit WhatsNew (JA)"
										onCancel={() =>
											(editingWhatsNew = { lang: null, idx: null, entry: { date: '', title: '' } })}
										onSave={() => saveWhatsNewEntry()}
									>
										<Input
											bind:value={editingWhatsNew.entry.date}
											placeholder="Date"
											class="font-mono"
										/>
										<Input bind:value={editingWhatsNew.entry.title} placeholder="Title" />
									</EditPanel>
								{/if}
							</div>
							<div>
								<Label class="font-bold mb-2 block">English Content</Label>
								<div class="space-y-2">
									<Input bind:value={editingTool.i18n.en.name} placeholder="Name" />
									<Input bind:value={editingTool.i18n.en.description} placeholder="Description" />
									<Input bind:value={editingTool.i18n.en.tagline} placeholder="Tagline" />
									<Textarea
										bind:value={editingTool.i18n.en.highlights}
										placeholder="Highlights (Markdown)"
										rows={3}
									/>
								</div>
							</div>
							<div>
								<Label class="font-bold mb-2 block">WhatsNew (EN)</Label>
								{#if editingTool.i18n.en.whatsNew}
									{#each editingTool.i18n.en.whatsNew as entry, idx}
										<div class="flex gap-2 items-center mb-1">
											<Input
												bind:value={entry.date}
												placeholder="Date"
												class="font-mono text-sm h-8 flex-1"
											/>
											<Input
												bind:value={entry.title}
												placeholder="Title"
												class="font-mono text-sm h-8 flex-2"
											/>
											<Button
												variant="ghost"
												size="icon"
												class="h-8 w-8 shrink-0"
												onclick={() => removeWhatsNew('en', idx)}
											>
												<Trash2 class="h-3 w-3 text-red-500" />
											</Button>
										</div>
									{/each}
								{/if}
								<Button variant="outline" size="sm" onclick={() => addWhatsNew('en')}>
									<Plus class="h-3 w-3 mr-1" /> Add
								</Button>
								{#if editingWhatsNew.lang === 'en' && editingWhatsNew.entry.title !== ''}
									<EditPanel
										title="Edit WhatsNew (EN)"
										onCancel={() =>
											(editingWhatsNew = { lang: null, idx: null, entry: { date: '', title: '' } })}
										onSave={() => saveWhatsNewEntry()}
									>
										<Input
											bind:value={editingWhatsNew.entry.date}
											placeholder="Date"
											class="font-mono"
										/>
										<Input bind:value={editingWhatsNew.entry.title} placeholder="Title" />
									</EditPanel>
								{/if}
							</div>
							<Separator />
							<div>
								<div class="flex items-center justify-between mb-2">
									<Label class="font-bold">Screenshots</Label>
									{#if !editingScreenshot && editingInlineScreenshotIdx === null}
										<Button
											variant="outline"
											size="sm"
											onclick={() => (editingScreenshot = { idx: -1, url: '' })}
										>
											<Plus class="h-3 w-3 mr-1" /> Add
										</Button>
									{/if}
								</div>
								{#if editingTool?.category === 'webapp' && editingTool.screenshots}
									<InlineArrayEditor
										items={editingTool.screenshots}
										onAdd={() => (editingScreenshot = { idx: -1, url: '' })}
										onRemove={removeScreenshot}
										onEdit={startEditInlineScreenshot}
										onMove={moveScreenshot}
										itemLabel="Screenshots"
										showAddButton={false}
									>
										<svelte:fragment slot="item" let:item let:idx>
											{#if editingInlineScreenshotIdx === idx}
												<Input
													bind:value={inlineScreenshotValue}
													class="flex-1 font-mono text-xs h-6"
													onkeydown={(e) => {
														if (e.key === 'Enter') saveInlineScreenshot();
														if (e.key === 'Escape') cancelEditInlineScreenshot();
													}}
												/>
												<Button size="sm" class="h-6 px-2" onclick={saveInlineScreenshot}>OK</Button>
												<Button size="sm" class="h-6 px-2" variant="outline" onclick={cancelEditInlineScreenshot}>Cancel</Button>
											{:else}
												<span class="flex-1 font-mono text-xs truncate">{item}</span>
											{/if}
										</svelte:fragment>
									</InlineArrayEditor>
								{/if}
								{#if editingScreenshot?.idx === -1}
									<div class="flex gap-2 items-center mt-2">
										<Input
											bind:value={editingScreenshot.url}
											placeholder="Screenshot URL"
											class="font-mono text-xs"
											onkeydown={(e) => e.key === 'Enter' && addScreenshot()}
										/>
										<Button size="sm" onclick={addScreenshot}>Add</Button>
										<Button size="sm" variant="outline" onclick={() => (editingScreenshot = null)}>Cancel</Button>
									</div>
								{/if}
							</div>

							{#if editingTool?.category === 'library'}
								<Separator />
								<div>
									{#if editingTool.usedBy}
										<InlineArrayEditor
											items={editingTool.usedBy}
											onAdd={() => (editingUsedBy = { idx: null, entry: { title: '', url: '' } })}
											onRemove={removeUsedBy}
											onEdit={(idx, item) =>
												(editingUsedBy = { idx, entry: { ...item, i18n: { ...item.i18n } } })}
											onMove={moveUsedBy}
											itemLabel="Used By"
										>
											<svelte:fragment slot="item" let:item let:idx>
												<span class="flex-1 text-sm">{item.title}</span>
												{#if item.author}
													<span class="text-xs text-muted-foreground">by {item.author}</span>
												{/if}
											</svelte:fragment>
										</InlineArrayEditor>
									{/if}
									{#if editingUsedBy.idx !== null || editingUsedBy.entry.title === ''}
										<EditPanel
											title={editingUsedBy.idx !== null ? 'Edit UsedBy Entry' : 'Add UsedBy Entry'}
											onCancel={() =>
												(editingUsedBy = { idx: null, entry: { title: '', url: '' } })}
											onSave={addUsedBy}
										>
											<Input bind:value={editingUsedBy.entry.title} placeholder="Title" />
											<Input
												bind:value={editingUsedBy.entry.author}
												placeholder="Author (optional)"
											/>
											<Input
												bind:value={editingUsedBy.entry.url}
												placeholder="URL"
												class="font-mono"
											/>
										</EditPanel>
									{/if}
								</div>
							{/if}

							<Separator />
							<div>
								{#if editingTool.faqs}
									<InlineArrayEditor
										items={editingTool.faqs}
										onAdd={addToolFaq}
										onRemove={removeToolFaq}
										onEdit={(idx, item) =>
											(editingToolFaq = { idx, entry: { ...item, i18n: { ...item.i18n } } })}
										onMove={moveToolFaq}
										itemLabel="Tool FAQs"
									>
										<svelte:fragment slot="item" let:item let:idx>
											<span class="flex-1 text-sm font-mono">{item.id}</span>
										</svelte:fragment>
									</InlineArrayEditor>
								{/if}
								{#if editingToolFaq.entry.id || editingToolFaq.idx !== null}
									<EditPanel
										title="Edit Tool FAQ"
										onCancel={() =>
											(editingToolFaq = {
												idx: null,
												entry: { id: '', i18n: { ja: {}, en: {} } }
											})}
										onSave={saveToolFaq}
									>
										<Input
											bind:value={editingToolFaq.entry.id}
											placeholder="FAQ ID"
											class="font-mono"
										/>
										{#each Object.keys(editingToolFaq.entry.i18n) as lang}
											<div class="space-y-1">
												<Label class="text-xs">{lang}</Label>
												<Input
													bind:value={editingToolFaq.entry.i18n[lang].question}
													placeholder="Question"
													class="text-sm"
												/>
												<Textarea
													bind:value={editingToolFaq.entry.i18n[lang].answer}
													placeholder="Answer"
													rows={2}
													class="text-sm"
												/>
											</div>
										{/each}
									</EditPanel>
								{/if}
							</div>
							<Separator />
							<div>
								{#if editingTool.relatedLinks}
									<InlineArrayEditor
										items={editingTool.relatedLinks}
										onAdd={addRelatedLink}
										onRemove={removeRelatedLink}
										onEdit={(idx, item) => (editingRelatedLink = { idx, entry: { ...item } })}
										onMove={moveRelatedLinks}
										itemLabel="Related Links"
									>
										<svelte:fragment slot="item" let:item let:idx>
											<span class="flex-1 text-sm font-mono">{item.type}</span>
											{#if item.toolId}
												<span class="text-xs text-muted-foreground">→ {item.toolId}</span>
											{/if}
											{#if item.url}
												<span class="text-xs text-muted-foreground truncate max-w-[150px]"
													>{item.url}</span
												>
											{/if}
										</svelte:fragment>
									</InlineArrayEditor>
								{/if}
								{#if editingRelatedLink.entry.type || editingRelatedLink.idx !== null}
									<EditPanel
										title="Edit Related Link"
										onCancel={() =>
											(editingRelatedLink = {
												idx: null,
												entry: { type: '', url: '', toolId: '' }
											})}
										onSave={() => saveRelatedLinkEntry()}
									>
										<select
											oninput={(e) => {
												editingRelatedLink.entry.type = (e.target as HTMLSelectElement).value;
											}}
										>
											<option value="source" selected={editingRelatedLink.entry.type === 'source'}
												>source</option
											>
											<option
												value="related-tool"
												selected={editingRelatedLink.entry.type === 'related-tool'}
												>related-tool</option
											>
										</select>
										{#if editingRelatedLink.entry.type === 'source' || editingRelatedLink.entry.type === ''}
											<Input
												bind:value={editingRelatedLink.entry.url}
												placeholder="URL"
												class="font-mono"
											/>
										{/if}
										{#if editingRelatedLink.entry.type === 'related-tool'}
											<Input
												bind:value={editingRelatedLink.entry.toolId}
												placeholder="Tool ID"
												class="font-mono"
											/>
										{/if}
									</EditPanel>
								{/if}
							</div>
							<Separator />
							<div class="flex gap-2 justify-end mt-10 items-center">
								<span class="font-mono">{editingKey}</span>
								<Button variant="outline" onclick={cancelToolEditor}>Cancel</Button>
								<Button onclick={saveTool}>Save</Button>
							</div>
						</div>
					{/if}

					<!-- Tools table -->
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead class="w-40">Tool ID</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Audience</TableHead>
								<TableHead>Name (JA)</TableHead>
								<TableHead class="w-24">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{@const toolsMap = localData as ToolsMap}
							{#each Object.entries(toolsMap) as [key, tool]}
								<TableRow class={editingKey === key ? 'bg-muted/50' : ''}>
									<TableCell class="font-mono font-bold">{key}</TableCell>
									<TableCell
										><span class="px-2 py-0.5 rounded text-xs bg-muted">{tool.category}</span
										></TableCell
									>
									<TableCell
										><span class="px-2 py-0.5 rounded text-xs bg-muted">{tool.audience}</span
										></TableCell
									>
									<TableCell>{tool.i18n?.ja?.name || '-'}</TableCell>
									<TableCell>
										<div class="flex gap-1">
											<Button variant="ghost" size="icon" onclick={() => openToolEditor(key)}>
												<Pencil class="h-4 w-4" />
											</Button>
											<Button variant="ghost" size="icon" onclick={() => removeTool(key)}>
												<Trash2 class="h-4 w-4 text-red-500" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							{/each}
						</TableBody>
					</Table>
					<Separator class="my-4" />
					<div class="flex gap-2 items-center">
						<Input
							bind:value={newToolKey}
							placeholder="New tool ID"
							class="font-mono"
							onkeydown={(e) => e.key === 'Enter' && addTool()}
						/>
						<Button size="sm" onclick={addTool}>Add Tool</Button>
					</div>
				</div>
			{/if}
		{:else}
			<!-- Raw JSON editor -->
			<div class="relative">
				<Textarea
					bind:value={rawText}
					class="font-mono text-sm w-full min-h-[500px] resize-y"
					spellcheck={false}
				/>
			</div>
		{/if}
	</CardContent>
</Card>

<style lang="postcss">
	@reference "tailwindcss";
</style>
