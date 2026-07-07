<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { Plus, X } from '@lucide/svelte';
	import InlineArrayEditor from '../InlineArrayEditor.svelte';
	import EditPanel from '../EditPanel.svelte';
	import { useToolDetail } from './useToolDetail.svelte.ts';
	import type { Tool } from './useToolDetail.svelte.ts';
import { RELATEDLINK } from '$lib/types';

	interface Props {
		tool: Tool | null;
		toolKey: string;
		onChange: (tool: Tool) => void;
		onCancel: () => void;
	}

	let { tool, toolKey, onChange, onCancel }: Props = $props();

	const toolDetail = useToolDetail(tool);

	// composable内部の$state変数はgetter経由でしか参照できないため、
	// テンプレート内で使用する値は$derivedでラップし、参照の再計算を保証する。
	let state = $derived(toolDetail.tool);
	let editingScreenshot = $derived(toolDetail.editingScreenshot);
	let editingInlineScreenshotIdx = $derived(toolDetail.editingInlineScreenshotIdx);
	let inlineScreenshotValue = $derived(toolDetail.inlineScreenshotValue);
	let editingUsedBy = $derived(toolDetail.editingUsedBy);
	let editingToolFaq = $derived(toolDetail.editingToolFaq);
	let editingRelatedLink = $derived(toolDetail.editingRelatedLink);
	let editingWhatsNew = $derived(toolDetail.editingWhatsNew);

	$effect(() => {
		toolDetail.setTool(tool);
	});

	function handleSave() {
		const result = toolDetail.save();
		if (result) onChange(result);
	}
</script>

<div class="bg-muted/50 p-4 rounded-lg space-y-4 shadow">
	{#if state}
		<div class="flex items-center justify-between">
			<span class="font-bold">Edit Tool: <span class="font-mono">{toolKey}</span></span>
			<Button variant="ghost" size="icon" onclick={onCancel}>
				<X class="h-4 w-4" />
			</Button>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<div>
				<Label>Category</Label>
				<select
					oninput={(e) =>
						toolDetail.updateField('category', (e.target as HTMLSelectElement).value as Tool['category'])}
				>
					<option value="webapp" selected={state.category === 'webapp'}>webapp</option>
					<option value="library" selected={state.category === 'library'}>library</option>
					<option value="extension" selected={state.category === 'extension'}>extension</option>
				</select>
			</div>
			<div>
				<Label>Audience</Label>
				<select oninput={(e) => toolDetail.updateField('audience', (e.target as HTMLSelectElement).value)}>
					<option value="enduser" selected={state.audience === 'enduser'}>enduser</option>
					<option value="developer" selected={state.audience === 'developer'}>developer</option>
				</select>
			</div>
			<div>
				<Label>Website URL</Label>
				<Input bind:value={state.websiteUrl} />
			</div>
			<div>
				<Label>Icon URL</Label>
				<Input bind:value={state.icon} />
			</div>
		</div>

		<Separator />

		<div>
			<Label class="font-bold mb-2 block">Japanese Content</Label>
			<div class="space-y-2">
				<div class="space-y-1">
					<Label class="text-xs text-muted-foreground">Name</Label>
					<Input bind:value={state.i18n.ja.name} placeholder="Name" />
				</div>
				<div class="space-y-1">
					<Label class="text-xs text-muted-foreground">Description</Label>
					<Input bind:value={state.i18n.ja.description} placeholder="Description" />
				</div>
				<div class="space-y-1">
					<Label class="text-xs text-muted-foreground">Tagline</Label>
					<Input bind:value={state.i18n.ja.tagline} placeholder="Tagline" />
				</div>
				<div class="space-y-1">
					<Label class="text-xs text-muted-foreground">Highlights (Markdown)</Label>
					<Textarea
						bind:value={state.i18n.ja.highlights}
						placeholder="Highlights (Markdown)"
						rows={3}
					/>
				</div>
			</div>
		</div>

		<div>
			<Label class="font-bold mb-2 block">WhatsNew (JA)</Label>
			{#if state.i18n.ja.whatsNew}
				{#if state.i18n.ja.whatsNew.length > 0}
					<div class="flex gap-2 items-center mb-1 text-xs text-muted-foreground">
						<span class="flex-1">Date</span>
						<span class="flex-2">Title</span>
						<span class="h-8 w-8 shrink-0"></span>
					</div>
				{/if}
				{#each state.i18n.ja.whatsNew as entry, idx}
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
							onclick={() => toolDetail.removeWhatsNew('ja', idx)}
						>
							<X class="h-3 w-3 text-red-500" />
						</Button>
					</div>
				{/each}
			{/if}
			<Button variant="outline" size="sm" onclick={() => toolDetail.addWhatsNew('ja')}>
				<Plus class="h-3 w-3 mr-1" /> Add
			</Button>
			{#if editingWhatsNew.lang === 'ja' && editingWhatsNew.entry.title !== ''}
				<EditPanel
					title="Edit WhatsNew (JA)"
					onCancel={() =>
						toolDetail.setEditingWhatsNew({ lang: null, idx: null, entry: { date: '', title: '' } })}
					onSave={toolDetail.saveWhatsNewEntry}
				>
					<div class="space-y-1">
						<Label class="text-xs">Date</Label>
						<Input bind:value={editingWhatsNew.entry.date} placeholder="Date" class="font-mono" />
					</div>
					<div class="space-y-1">
						<Label class="text-xs">Title</Label>
						<Input bind:value={editingWhatsNew.entry.title} placeholder="Title" />
					</div>
				</EditPanel>
			{/if}
		</div>

		<div>
			<Label class="font-bold mb-2 block">English Content</Label>
			<div class="space-y-2">
				<div class="space-y-1">
					<Label class="text-xs text-muted-foreground">Name</Label>
					<Input bind:value={state.i18n.en.name} placeholder="Name" />
				</div>
				<div class="space-y-1">
					<Label class="text-xs text-muted-foreground">Description</Label>
					<Input bind:value={state.i18n.en.description} placeholder="Description" />
				</div>
				<div class="space-y-1">
					<Label class="text-xs text-muted-foreground">Tagline</Label>
					<Input bind:value={state.i18n.en.tagline} placeholder="Tagline" />
				</div>
				<div class="space-y-1">
					<Label class="text-xs text-muted-foreground">Highlights (Markdown)</Label>
					<Textarea
						bind:value={state.i18n.en.highlights}
						placeholder="Highlights (Markdown)"
						rows={3}
					/>
				</div>
			</div>
		</div>

		<div>
			<Label class="font-bold mb-2 block">WhatsNew (EN)</Label>
			{#if state.i18n.en.whatsNew}
				{#if state.i18n.en.whatsNew.length > 0}
					<div class="flex gap-2 items-center mb-1 text-xs text-muted-foreground">
						<span class="flex-1">Date</span>
						<span class="flex-2">Title</span>
						<span class="h-8 w-8 shrink-0"></span>
					</div>
				{/if}
				{#each state.i18n.en.whatsNew as entry, idx}
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
							onclick={() => toolDetail.removeWhatsNew('en', idx)}
						>
							<X class="h-3 w-3 text-red-500" />
						</Button>
					</div>
				{/each}
			{/if}
			<Button variant="outline" size="sm" onclick={() => toolDetail.addWhatsNew('en')}>
				<Plus class="h-3 w-3 mr-1" /> Add
			</Button>
			{#if editingWhatsNew.lang === 'en' && editingWhatsNew.entry.title !== ''}
				<EditPanel
					title="Edit WhatsNew (EN)"
					onCancel={() =>
						toolDetail.setEditingWhatsNew({ lang: null, idx: null, entry: { date: '', title: '' } })}
					onSave={toolDetail.saveWhatsNewEntry}
				>
					<div class="space-y-1">
						<Label class="text-xs">Date</Label>
						<Input bind:value={editingWhatsNew.entry.date} placeholder="Date" class="font-mono" />
					</div>
					<div class="space-y-1">
						<Label class="text-xs">Title</Label>
						<Input bind:value={editingWhatsNew.entry.title} placeholder="Title" />
					</div>
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
						onclick={() => toolDetail.setEditingScreenshot({ idx: -1, url: '' })}
					>
						<Plus class="h-3 w-3 mr-1" /> Add
					</Button>
				{/if}
			</div>
			{#if state.category === 'webapp' && state.screenshots}
				<InlineArrayEditor
					items={state.screenshots}
					onAdd={() => toolDetail.setEditingScreenshot({ idx: -1, url: '' })}
					onRemove={toolDetail.removeScreenshot}
					onEdit={toolDetail.startEditInlineScreenshot}
					onMove={toolDetail.moveScreenshot}
					itemLabel="Screenshots"
					showAddButton={false}
				>
					{#snippet slotItem({ item, idx }: { item: string; idx: number })}
						{#if editingInlineScreenshotIdx === idx}
							<Input
								value={inlineScreenshotValue}
								class="flex-1 font-mono text-xs h-6"
								oninput={(e) => toolDetail.setInlineScreenshotValue((e.target as HTMLInputElement).value)}
								onkeydown={(e) => {
									if (e.key === 'Enter') toolDetail.saveInlineScreenshot();
									if (e.key === 'Escape') toolDetail.cancelEditInlineScreenshot();
								}}
							/>
							<Button size="sm" class="h-6 px-2" onclick={toolDetail.saveInlineScreenshot}>OK</Button>
							<Button
								size="sm"
								class="h-6 px-2"
								variant="outline"
								onclick={toolDetail.cancelEditInlineScreenshot}>Cancel</Button
							>
						{:else}
							<span class="flex-1 font-mono text-xs truncate">{item}</span>
						{/if}
					{/snippet}
				</InlineArrayEditor>
			{/if}
			{#if editingScreenshot?.idx === -1}
				<div class="mt-2 space-y-1">
					<Label class="text-xs text-muted-foreground">Screenshot URL</Label>
					<div class="flex gap-2 items-center">
						<Input
							bind:value={editingScreenshot.url}
							placeholder="Screenshot URL"
							class="font-mono text-xs"
							onkeydown={(e) => e.key === 'Enter' && toolDetail.addScreenshot()}
						/>
						<Button size="sm" onclick={toolDetail.addScreenshot}>Add</Button>
						<Button size="sm" variant="outline" onclick={() => toolDetail.setEditingScreenshot(null)}
							>Cancel</Button
						>
					</div>
				</div>
			{/if}
		</div>

		{#if state.category === 'library'}
			<Separator />
			<div>
				{#if state.usedBy}
					<InlineArrayEditor
						items={state.usedBy}
						onAdd={() => toolDetail.setEditingUsedBy({ idx: null, entry: { title: '', url: '' } })}
						onRemove={toolDetail.removeUsedBy}
						onEdit={(idx, item) =>
							toolDetail.setEditingUsedBy({ idx, entry: { ...item } })}
						onMove={toolDetail.moveUsedBy}
						itemLabel="Used By"
					>
						{#snippet slotItem({ item }: { item: { title: string; author?: string } })}
							<span class="flex-1 text-sm">{item.title}</span>
							{#if item.author}
								<span class="text-xs text-muted-foreground">by {item.author}</span>
							{/if}
						{/snippet}
					</InlineArrayEditor>
				{/if}
				{#if editingUsedBy.idx !== null || editingUsedBy.entry.title === ''}
					<EditPanel
						title={editingUsedBy.idx !== null ? 'Edit UsedBy Entry' : 'Add UsedBy Entry'}
						onCancel={() => toolDetail.setEditingUsedBy({ idx: null, entry: { title: '', url: '' } })}
						onSave={toolDetail.addUsedBy}
					>
						<div class="space-y-1">
							<Label class="text-xs">Title</Label>
							<Input bind:value={editingUsedBy.entry.title} placeholder="Title" />
						</div>
						<div class="space-y-1">
							<Label class="text-xs">Author (optional)</Label>
							<Input bind:value={editingUsedBy.entry.author} placeholder="Author (optional)" />
						</div>
						<div class="space-y-1">
							<Label class="text-xs">URL</Label>
							<Input bind:value={editingUsedBy.entry.url} placeholder="URL" class="font-mono" />
						</div>
					</EditPanel>
				{/if}
			</div>
		{/if}

		<Separator />
		<div>
			{#if state.faqs}
				<InlineArrayEditor
					items={state.faqs}
					onAdd={toolDetail.addToolFaq}
					onRemove={toolDetail.removeToolFaq}
					onEdit={(idx, item) =>
						toolDetail.setEditingToolFaq({ idx, entry: { ...item, i18n: { ...item.i18n } } })}
					onMove={toolDetail.moveToolFaq}
					itemLabel="Tool FAQs"
				>
					{#snippet slotItem({ item }: { item: { id: string } })}
						<span class="flex-1 text-sm font-mono">{item.id}</span>
					{/snippet}
				</InlineArrayEditor>
			{/if}
			{#if editingToolFaq.entry.id || editingToolFaq.idx !== null}
				<EditPanel
					title="Edit Tool FAQ"
					onCancel={() =>
						toolDetail.setEditingToolFaq({
							idx: null,
							entry: { id: '', i18n: { ja: {}, en: {} } }
						})}
					onSave={toolDetail.saveToolFaq}
				>
					<div class="space-y-1">
						<Label class="text-xs">FAQ ID</Label>
						<Input bind:value={editingToolFaq.entry.id} placeholder="FAQ ID" class="font-mono" />
					</div>
					{#each Object.keys(editingToolFaq.entry.i18n) as lang}
						<div class="space-y-1">
							<Label class="text-xs">{lang}</Label>
							<div class="space-y-1">
								<Label class="text-xs text-muted-foreground">Question</Label>
								<Input
									bind:value={editingToolFaq.entry.i18n[lang].question}
									placeholder="Question"
									class="text-sm"
								/>
							</div>
							<div class="space-y-1">
								<Label class="text-xs text-muted-foreground">Answer</Label>
								<Textarea
									bind:value={editingToolFaq.entry.i18n[lang].answer}
									placeholder="Answer"
									rows={2}
									class="text-sm"
								/>
							</div>
						</div>
					{/each}
				</EditPanel>
			{/if}
		</div>

		<Separator />
		<div>
			{#if state.relatedLinks}
				<InlineArrayEditor
					items={state.relatedLinks}
					onAdd={toolDetail.addRelatedLink}
					onRemove={toolDetail.removeRelatedLink}
					onEdit={(idx, item) => toolDetail.setEditingRelatedLink({
	idx,
	entry: { ...item, i18n: { ja: { ...item.i18n?.ja }, en: { ...item.i18n?.en } } }
})}
	onMove={toolDetail.moveRelatedLinks}
					itemLabel="Related Links"
				>
					{#snippet slotItem({ item }: { item: { type: string; toolId?: string; url?: string } })}
						<span class="flex-1 text-sm font-mono">{item.type}</span>
						{#if item.toolId}
							<span class="text-xs text-muted-foreground">→ {item.toolId}</span>
						{/if}
						{#if item.url}
							<span class="text-xs text-muted-foreground truncate max-w-[150px]">{item.url}</span>
						{/if}
					{/snippet}
				</InlineArrayEditor>
			{/if}
			{#if editingRelatedLink.entry.type || editingRelatedLink.idx !== null}
		<EditPanel
			title="Edit Related Link"
			onCancel={() =>
				toolDetail.setEditingRelatedLink({
					idx: null,
					entry: { type: '', url: '', toolId: '', i18n: { ja: {}, en: {} } }
				})}
			onSave={toolDetail.saveRelatedLinkEntry}
		>
			<div class="space-y-1">
				<Label class="text-xs">Type</Label>
				<select
					oninput={(e) => {
						editingRelatedLink.entry.type = (e.target as HTMLSelectElement).value;
					}}
				>
					{#each RELATEDLINK as t}
						<option value={t} selected={editingRelatedLink.entry.type === t}>{t}</option>
					{/each}
				</select>
			</div>
			{#if editingRelatedLink.entry.type !== 'related-tool' && editingRelatedLink.entry.type !== ''}
				<div class="space-y-1">
					<Label class="text-xs">URL</Label>
					<Input bind:value={editingRelatedLink.entry.url} placeholder="URL" class="font-mono" />
				</div>
			{/if}
			{#if editingRelatedLink.entry.type === 'related-tool'}
				<div class="space-y-1">
					<Label class="text-xs">Tool ID</Label>
					<Input
						bind:value={editingRelatedLink.entry.toolId}
						placeholder="Tool ID"
						class="font-mono"
					/>
				</div>
			{/if}
			{#if editingRelatedLink.entry.type === 'external'}
				<div class="space-y-1">
					<Label class="text-xs">Title (JA)</Label>
					<Input bind:value={editingRelatedLink.entry.i18n.ja.title} placeholder="Title" />
				</div>
				<div class="space-y-1">
					<Label class="text-xs">Description (JA)</Label>
					<Textarea
						bind:value={editingRelatedLink.entry.i18n.ja.description}
						placeholder="Description"
						rows={2}
					/>
				</div>
				<div class="space-y-1">
					<Label class="text-xs">Title (EN)</Label>
					<Input bind:value={editingRelatedLink.entry.i18n.en.title} placeholder="Title" />
				</div>
				<div class="space-y-1">
					<Label class="text-xs">Description (EN)</Label>
					<Textarea
						bind:value={editingRelatedLink.entry.i18n.en.description}
						placeholder="Description"
						rows={2}
					/>
				</div>
			{/if}
		</EditPanel>
	{/if}
		</div>

		<Separator />
		<div class="flex gap-2 justify-end mt-10 items-center">
			<span class="font-mono">{toolKey}</span>
			<Button variant="outline" onclick={onCancel}>Cancel</Button>
			<Button onclick={handleSave}>Save</Button>
		</div>
	{/if}
</div>