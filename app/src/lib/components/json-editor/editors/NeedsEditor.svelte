<script module lang="ts">
	export interface NeedEntry {
		id: string;
		icon: string;
		i18n: { ja: { title: string }; en: { title: string } };
		toolList: string[];
	}
</script>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Pencil, Trash2, Plus, X } from '@lucide/svelte';
	import MoveButtons from '../MoveButtons.svelte';

	let { entries, onChange }: { entries: NeedEntry[]; onChange: (entries: NeedEntry[]) => void } = $props();

	let editing = $state<{ idx: number | null; entry: NeedEntry | null }>({ idx: null, entry: null });
	let toolIdInput = $state('');

	function remove(idx: number) {
		onChange(entries.filter((_: NeedEntry, i: number) => i !== idx));
	}

	function move(from: number, to: number) {
		if (to < 0 || to >= entries.length) return;
		const arr = [...entries];
		const [item] = arr.splice(from, 1);
		arr.splice(to, 0, item);
		onChange(arr);
	}

	function add() {
		onChange([...entries, {
			id: `need-${Date.now()}`,
			icon: 'Star',
			i18n: { ja: { title: '' }, en: { title: '' } },
			toolList: []
		}]);
	}

	function save(entry: NeedEntry) {
		if (editing.idx !== null) {
			onChange(entries.map((item, i) => i === editing.idx ? entry : item));
		} else {
			onChange([...entries, entry]);
		}
		editing = { idx: null, entry: null };
	}

	function addTool(needIdx: number, toolId: string) {
		if (!toolId.trim()) return;
		const entry = entries[needIdx];
		if (entry.toolList.includes(toolId.trim())) return;
		const updated = { ...entry, toolList: [...entry.toolList, toolId.trim()] };
		onChange(entries.map((item, i) => i === needIdx ? updated : item));
		toolIdInput = '';
	}

	function removeTool(needIdx: number, toolId: string) {
		const entry = entries[needIdx];
		const updated = { ...entry, toolList: entry.toolList.filter((t) => t !== toolId) };
		onChange(entries.map((item, i) => i === needIdx ? updated : item));
	}

	function moveTool(needIdx: number, from: number, to: number) {
		const entry = entries[needIdx];
		if (to < 0 || to >= entry.toolList.length) return;
		const arr = [...entry.toolList];
		const [item] = arr.splice(from, 1);
		arr.splice(to, 0, item);
		onChange(entries.map((item, i) => i === needIdx ? { ...item, toolList: arr } : item));
	}
</script>

<div class="space-y-4">
	{#each entries as need, i}
		<Card class="relative">
			<CardHeader class="pb-3">
				<div class="flex items-center justify-between">
					<CardTitle class="text-base flex items-center gap-2">
						<span class="font-mono text-sm bg-muted px-2 py-0.5 rounded">{need.id}</span>
						<span>{need.i18n.ja.title}</span>
					</CardTitle>
					<div class="flex gap-1">
						<MoveButtons
							onUp={() => move(i, i - 1)}
							onDown={() => move(i, i + 1)}
							disabledUp={i === 0}
							disabledDown={i === entries.length - 1}
						/>
						<Button variant="ghost" size="icon" onclick={() => (editing = { idx: i, entry: { ...need } })}>
							<Pencil class="h-4 w-4" />
						</Button>
						<Button variant="ghost" size="icon" onclick={() => remove(i)}>
							<Trash2 class="h-4 w-4 text-red-500" />
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent class="pb-3">
				<Label class="text-xs mb-1 block">Associated Tools</Label>
				<div class="flex flex-wrap gap-1 mb-2">
					{#each need.toolList as tool, tIdx}
						<span class="inline-flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm font-mono">
							<span class="flex gap-0.5">
								<button
									class="hover:text-blue-500 disabled:opacity-30"
									onclick={() => moveTool(i, tIdx, tIdx - 1)}
									disabled={tIdx === 0}
									title="Move up">↑</button
								>
								<button
									class="hover:text-blue-500 disabled:opacity-30"
									onclick={() => moveTool(i, tIdx, tIdx + 1)}
									disabled={tIdx === need.toolList.length - 1}
									title="Move down">↓</button
								>
							</span>
							{tool}
							<button
								onclick={() => removeTool(i, tool)}
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
						onkeydown={(e) => e.key === 'Enter' && addTool(i, toolIdInput)}
					/>
					<Button size="sm" variant="outline" onclick={() => addTool(i, toolIdInput)}>Add tool</Button>
				</div>
			</CardContent>
		</Card>
	{/each}
</div>

<Separator class="my-4" />
<Button variant="outline" size="sm" onclick={add}>
	<Plus class="h-4 w-4 mr-1" /> Add Need Category
</Button>

{#if editing.entry}
	<Separator class="my-4" />
	<div class="bg-muted/50 p-4 rounded-lg space-y-4 shadow">
		<div class="flex items-center justify-between">
			<span class="font-bold">Edit Need Entry</span>
			<Button variant="ghost" size="icon" onclick={() => (editing = { idx: null, entry: null })}>
				<X class="h-4 w-4" />
			</Button>
		</div>
		<div class="grid grid-cols-2 gap-4">
			<div>
				<Label>ID</Label>
				<Input bind:value={editing.entry!.id} class="font-mono" />
			</div>
			<div>
				<Label>Icon (Lucide name)</Label>
				<Input bind:value={editing.entry!.icon} />
			</div>
		</div>
		<div class="grid grid-cols-2 gap-4">
			<div>
				<Label class="font-bold">Japanese</Label>
				<Input bind:value={editing.entry!.i18n.ja.title} class="mt-1" />
			</div>
			<div>
				<Label class="font-bold">English</Label>
				<Input bind:value={editing.entry!.i18n.en.title} class="mt-1" />
			</div>
		</div>
		<div class="flex gap-2 justify-end">
			<Button variant="outline" onclick={() => (editing = { idx: null, entry: null })}>Cancel</Button>
			<Button onclick={() => save(editing.entry!)}>Save</Button>
		</div>
	</div>
{/if}
