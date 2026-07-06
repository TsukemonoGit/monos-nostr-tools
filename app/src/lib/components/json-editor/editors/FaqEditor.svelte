<script module lang="ts">
	export interface FaqEntry {
		id: string;
		i18n: {
			ja: { question: string; answer: string };
			en: { question: string; answer: string };
		};
	}
</script>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$lib/components/ui/table';
	import { ChevronDown, ChevronRight, Pencil, Trash2, Plus, X } from '@lucide/svelte';
	import MoveButtons from '../MoveButtons.svelte';
	import EditPanel from '../EditPanel.svelte';

	let { entries, onChange }: { entries: FaqEntry[]; onChange: (entries: FaqEntry[]) => void } = $props();

	let expanded = $state<Set<number>>(new Set());
	let editing = $state<{ idx: number | null; entry: FaqEntry | null }>({ idx: null, entry: null });

	function remove(idx: number) {
		onChange(entries.filter((_: FaqEntry, i: number) => i !== idx));
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
			id: `faq-${Date.now()}`,
			i18n: {
				ja: { question: '', answer: '' },
				en: { question: '', answer: '' }
			}
		}]);
	}

	function toggle(idx: number) {
		const next = new Set(expanded);
		if (next.has(idx)) next.delete(idx);
		else next.add(idx);
		expanded = next;
	}

	function save(entry: FaqEntry) {
		if (editing.idx !== null) {
			onChange(entries.map((item, i) => i === editing.idx ? entry : item));
		} else {
			onChange([...entries, entry]);
		}
		editing = { idx: null, entry: null };
	}
</script>

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
		{#each entries as faq, i}
			<TableRow class="cursor-pointer" onclick={() => toggle(i)}>
				<TableCell>
					{#if expanded.has(i)}
						<ChevronDown class="h-4 w-4" />
					{:else}
						<ChevronRight class="h-4 w-4" />
					{/if}
				</TableCell>
				<TableCell class="font-mono text-sm">{faq.id}</TableCell>
				<TableCell>
					{faq.i18n.ja.question.substring(0, 40)}{faq.i18n.ja.question.length > 40 ? '...' : ''}
				</TableCell>
				<TableCell>
					{faq.i18n.en.question.substring(0, 40)}{faq.i18n.en.question.length > 40 ? '...' : ''}
				</TableCell>
				<TableCell>
					<div class="flex gap-1">
						<MoveButtons
							onUp={() => { expanded.delete(i); move(i, i - 1); }}
							onDown={() => { expanded.delete(i); move(i, i + 1); }}
							disabledUp={i === 0}
							disabledDown={i === entries.length - 1}
						/>
						<Button variant="ghost" size="icon" onclick={(e) => {
							e.stopPropagation();
							editing = { idx: i, entry: { ...faq } };
						}}>
							<Pencil class="h-4 w-4" />
						</Button>
						<Button variant="ghost" size="icon" onclick={(e) => {
							e.stopPropagation();
							remove(i);
						}}>
							<Trash2 class="h-4 w-4 text-red-500" />
						</Button>
					</div>
				</TableCell>
			</TableRow>
			{#if expanded.has(i)}
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
	</TableBody>
</Table>

<Separator class="my-4" />
<Button variant="outline" size="sm" onclick={add}>
	<Plus class="h-4 w-4 mr-1" /> Add FAQ
</Button>

{#if editing.entry}
	<Separator class="my-4" />
	<div class="bg-muted/50 p-4 rounded-lg space-y-4 shadow">
		<div class="flex items-center justify-between">
			<span class="font-bold">Edit FAQ Entry</span>
			<Button variant="ghost" size="icon" onclick={() => (editing = { idx: null, entry: null })}>
				<X class="h-4 w-4" />
			</Button>
		</div>
		<div>
			<Label class="mb-1 block">ID</Label>
			<Input bind:value={editing.entry!.id} class="font-mono" />
		</div>
		<div class="grid grid-cols-2 gap-4">
			<div>
				<Label class="font-bold mb-2 block">Japanese</Label>
				<Label class="text-xs mb-1 block">Question</Label>
				<Textarea bind:value={editing.entry!.i18n.ja.question} rows={2} class="mb-2" />
				<Label class="text-xs mb-1 block">Answer</Label>
				<Textarea bind:value={editing.entry!.i18n.ja.answer} rows={3} />
			</div>
			<div>
				<Label class="font-bold mb-2 block">English</Label>
				<Label class="text-xs mb-1 block">Question</Label>
				<Textarea bind:value={editing.entry!.i18n.en.question} rows={2} class="mb-2" />
				<Label class="text-xs mb-1 block">Answer</Label>
				<Textarea bind:value={editing.entry!.i18n.en.answer} rows={3} />
			</div>
		</div>
		<div class="flex gap-2 justify-end">
			<Button variant="outline" onclick={() => (editing = { idx: null, entry: null })}>Cancel</Button>
			<Button onclick={() => save(editing.entry!)}>Save</Button>
		</div>
	</div>
{/if}
