<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import InlineArrayEditor from '../InlineArrayEditor.svelte';
	import { Plus } from '@lucide/svelte';

	let {
		items,
		onChange
	}: {
		items: string[];
		onChange: (items: string[]) => void;
	} = $props();

	let adding = $state(false);
	let newValue = $state('');

	function add() {
		if (!newValue.trim()) return;
		onChange([...items, newValue.trim()]);
		newValue = '';
		adding = false;
	}

	function onRemove(idx: number) {
		onChange(items.filter((_: string, i: number) => i !== idx));
	}

	function onMove(from: number, to: number) {
		if (to < 0 || to >= items.length) return;
		const arr = [...items];
		const [item] = arr.splice(from, 1);
		arr.splice(to, 0, item);
		onChange(arr);
	}
</script>

<InlineArrayEditor
	items={items}
	onAdd={() => (adding = true)}
	onRemove={onRemove}
	onEdit={() => {}}
	onMove={onMove}
	itemLabel="Features"
>
	{#snippet slotItem({ item }: { item: string })}
		<span class="font-mono">{item}</span>
	{/snippet}
</InlineArrayEditor>

{#if adding}
	<div class="flex gap-2 items-center mt-2">
		<Input
			bind:value={newValue}
			placeholder="feature-id"
			onkeydown={(e) => e.key === 'Enter' && add()}
			class="font-mono"
		/>
		<Button size="sm" onclick={add}>Add</Button>
		<Button size="sm" variant="outline" onclick={() => { adding = false; newValue = ''; }}>Cancel</Button>
	</div>
{/if}
