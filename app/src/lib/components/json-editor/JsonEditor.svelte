<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Separator } from '$lib/components/ui/separator';
	import { Button } from '$lib/components/ui/button';
	import { RefreshCw, Save, FileJson, AlertCircle, Code2, TableIcon } from '@lucide/svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import FeaturesEditor from './editors/FeaturesEditor.svelte';
	import FaqEditor, { type FaqEntry } from './editors/FaqEditor.svelte';
	import NeedsEditor, { type NeedEntry } from './editors/NeedsEditor.svelte';
	import ToolsEditor, { type ToolsMap } from './editors/ToolsEditor.svelte';
	import ToolDetailEditor from './tool-editor/ToolDetailEditor.svelte';
	import type { Tool } from './tool-editor/useToolDetail.svelte.ts';

	export interface Props {
		file: string;
		data: unknown;
		onsave?: () => void;
	}

	let { file, data, onsave }: Props = $props();

	let viewMode = $state<'structured' | 'raw'>('structured');
	let rawText = $state('');
	let saveStatus = $state<'idle' | 'saving' | 'saved' | 'error'>('idle');
	let error = $state<string | null>(null);
	let localData = $state<unknown>(null);

	$effect(() => {
		localData = data;
	});

	$effect(() => {
		rawText = JSON.stringify(data, null, '\t');
	});

	async function save() {
		saveStatus = 'saving';
		error = null;
		try {
			const body = JSON.stringify({
				file,
				data: viewMode === 'raw' ? JSON.parse(rawText) : localData
			});
			const res = await fetch(`/gui/api?file=${file}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body
			});
			const result = await res.json();
			if (result.ok) {
				saveStatus = 'saved';
				onsave?.();
				setTimeout(() => (saveStatus = 'idle'), 2000);
			} else {
				saveStatus = 'error';
				error = result.error;
			}
		} catch {
			saveStatus = 'error';
			error = 'Failed to save';
		}
	}

	function refreshData() {
		fetch(`/gui/api?file=${file}`)
			.then((r) => r.json())
			.then((result) => {
				localData = result.content;
			})
			.catch(() => {});
	}

	// --- Features handlers ---
	function handleFeaturesChange(items: string[]) {
		localData = items;
	}

	// --- FAQ handlers ---
	function handleFaqChange(entries: FaqEntry[]) {
		localData = entries;
	}

	// --- Needs handlers ---
	function handleNeedsChange(entries: NeedEntry[]) {
		localData = entries;
	}

	// --- Tools handlers ---
	let editingTool = $state<{ key: string; tool: Tool } | null>(null);

	function handleToolsChange(toolsMap: ToolsMap) {
		localData = toolsMap;
	}

	function handleEditTool(key: string) {
		const toolsMap = localData as ToolsMap;
		if (toolsMap[key]) {
			editingTool = { key, tool: toolsMap[key] };
		}
	}

	function handleToolChange(tool: Tool) {
		if (!editingTool) return;
		const toolsMap = { ...(localData as ToolsMap) };
		toolsMap[editingTool.key] = tool;
		localData = toolsMap;
		editingTool = null;
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
				<FeaturesEditor items={localData as string[]} onChange={handleFeaturesChange} />
			{:else if file === 'faq.json'}
				<FaqEditor entries={localData as FaqEntry[]} onChange={handleFaqChange} />
			{:else if file === 'needs.json'}
				<NeedsEditor entries={localData as NeedEntry[]} onChange={handleNeedsChange} />
			{:else if file === 'tools.json'}
				<ToolsEditor
					tools={localData as ToolsMap}
					onChange={handleToolsChange}
					onEdit={handleEditTool}
				/>
			{/if}

			{#if editingTool}
				<ToolDetailEditor
					tool={editingTool.tool}
					toolKey={editingTool.key}
					onChange={handleToolChange}
					onCancel={() => (editingTool = null)}
				/>
			{/if}
		{:else}
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
