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

	interface Props {
		tool: Tool | null;
		toolKey: string;
		onChange: (tool: Tool) => void;
		onCancel: () => void;
	}

	let { tool, toolKey, onChange, onCancel }: Props = $props();

	const {
		tool: state,
		setTool,
		updateField,
		editingScreenshot,
		setEditingScreenshot,
		editingInlineScreenshotIdx,
		inlineScreenshotValue,
		setInlineScreenshotValue,
		addScreenshot,
		startEditInlineScreenshot,
		saveInlineScreenshot,
		cancelEditInlineScreenshot,
		removeScreenshot,
		moveScreenshot,
		editingUsedBy,
		setEditingUsedBy,
		addUsedBy,
		removeUsedBy,
		moveUsedBy,
		editingToolFaq,
		setEditingToolFaq,
		addToolFaq,
		removeToolFaq,
		moveToolFaq,
		saveToolFaq,
		editingRelatedLink,
		setEditingRelatedLink,
		addRelatedLink,
		removeRelatedLink,
		moveRelatedLinks,
		saveRelatedLinkEntry,
		editingWhatsNew,
		setEditingWhatsNew,
		addWhatsNew,
		removeWhatsNew,
		saveWhatsNewEntry,
		save
	} = useToolDetail(tool);

	$effect(() => {
		setTool(tool);
	});

	function handleSave() {
		const result = save();
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
						updateField('category', (e.target as HTMLSelectElement).value as Tool['category'])}
				>
					<option value="webapp" selected={state.category === 'webapp'}>webapp</option>
					<option value="library" selected={state.category === 'library'}>library</option>
					<option value="extension" selected={state.category === 'extension'}>extension</option>
				</select>
			</div>
			<div>
				<Label>Audience</Label>
				<select oninput={(e) => updateField('audience', (e.target as HTMLSelectElement).value)}>
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
							onclick={() => removeWhatsNew('ja', idx)}
						>
							<X class="h-3 w-3 text-red-500" />
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
						setEditingWhatsNew({ lang: null, idx: null, entry: { date: '', title: '' } })}
					onSave={saveWhatsNewEntry}
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
							onclick={() => removeWhatsNew('en', idx)}
						>
							<X class="h-3 w-3 text-red-500" />
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
						setEditingWhatsNew({ lang: null, idx: null, entry: { date: '', title: '' } })}
					onSave={saveWhatsNewEntry}
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
						onclick={() => setEditingScreenshot({ idx: -1, url: '' })}
					>
						<Plus class="h-3 w-3 mr-1" /> Add
					</Button>
				{/if}
			</div>
			{#if state.category === 'webapp' && state.screenshots}
				<InlineArrayEditor
					items={state.screenshots}
					onAdd={() => setEditingScreenshot({ idx: -1, url: '' })}
					onRemove={removeScreenshot}
					onEdit={startEditInlineScreenshot}
					onMove={moveScreenshot}
					itemLabel="Screenshots"
					showAddButton={false}
				>
					{#snippet slotItem({ item, idx }: { item: string; idx: number })}
						{#if editingInlineScreenshotIdx === idx}
							<Input
								value={inlineScreenshotValue}
								class="flex-1 font-mono text-xs h-6"
								oninput={(e) => setInlineScreenshotValue((e.target as HTMLInputElement).value)}
								onkeydown={(e) => {
									if (e.key === 'Enter') saveInlineScreenshot();
									if (e.key === 'Escape') cancelEditInlineScreenshot();
								}}
							/>
							<Button size="sm" class="h-6 px-2" onclick={saveInlineScreenshot}>OK</Button>
							<Button
								size="sm"
								class="h-6 px-2"
								variant="outline"
								onclick={cancelEditInlineScreenshot}>Cancel</Button
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
							onkeydown={(e) => e.key === 'Enter' && addScreenshot()}
						/>
						<Button size="sm" onclick={addScreenshot}>Add</Button>
						<Button size="sm" variant="outline" onclick={() => setEditingScreenshot(null)}
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
						onAdd={() => setEditingUsedBy({ idx: null, entry: { title: '', url: '' } })}
						onRemove={removeUsedBy}
						onEdit={(idx, item) =>
							setEditingUsedBy({ idx, entry: { ...item } })}
						onMove={moveUsedBy}
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
						onCancel={() => setEditingUsedBy({ idx: null, entry: { title: '', url: '' } })}
						onSave={addUsedBy}
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
					onAdd={addToolFaq}
					onRemove={removeToolFaq}
					onEdit={(idx, item) =>
						setEditingToolFaq({ idx, entry: { ...item, i18n: { ...item.i18n } } })}
					onMove={moveToolFaq}
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
						setEditingToolFaq({
							idx: null,
							entry: { id: '', i18n: { ja: {}, en: {} } }
						})}
					onSave={saveToolFaq}
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
					onAdd={addRelatedLink}
					onRemove={removeRelatedLink}
					onEdit={(idx, item) => setEditingRelatedLink({ idx, entry: { ...item } })}
					onMove={moveRelatedLinks}
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
						setEditingRelatedLink({
							idx: null,
							entry: { type: '', url: '', toolId: '' }
						})}
					onSave={saveRelatedLinkEntry}
				>
					<div class="space-y-1">
						<Label class="text-xs">Type</Label>
						<select
							oninput={(e) => {
								editingRelatedLink.entry.type = (e.target as HTMLSelectElement).value;
							}}
						>
							<option value="source" selected={editingRelatedLink.entry.type === 'source'}
								>source</option
							>
							<option value="related-tool" selected={editingRelatedLink.entry.type === 'related-tool'}
								>related-tool</option
							>
						</select>
					</div>
					{#if editingRelatedLink.entry.type === 'source' || editingRelatedLink.entry.type === ''}
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