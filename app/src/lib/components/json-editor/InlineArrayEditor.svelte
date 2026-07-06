<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { Plus, Pencil, Trash2 } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import MoveButtons from './MoveButtons.svelte';

	interface Props {
		items: any[];
		onAdd: () => void;
		onRemove: (idx: number) => void;
		onEdit: (idx: number, item: any) => void;
		onMove: (from: number, to: number) => void;
		itemLabel: string;
		showAddButton?: boolean;
		slotItem: Snippet<[{ item: any; idx: number }]>;
	}

	let {
		items,
		onAdd,
		onRemove,
		onEdit,
		onMove,
		itemLabel,
		showAddButton = true,
		slotItem
	}: Props = $props();
</script>

{#if showAddButton}
	<div class="flex items-center justify-between mb-2">
		<Label class="font-bold">{itemLabel}</Label>
		<Button variant="outline" size="sm" onclick={onAdd}>
			<Plus class="h-3 w-3 mr-1" /> Add
		</Button>
	</div>
{/if}

{#each items as it, idx}
	<div class="flex gap-1 items-center mb-1">
		<MoveButtons
			onUp={() => onMove(idx, idx - 1)}
			onDown={() => onMove(idx, idx + 1)}
			disabledUp={idx === 0}
			disabledDown={idx === items.length - 1}
		/>
		{@render slotItem({ item: it, idx })}
		<Button variant="ghost" size="icon" class="h-5 w-5" onclick={() => onEdit(idx, { ...it })}>
			<Pencil class="h-3 w-3" />
		</Button>
		<Button variant="ghost" size="icon" class="h-5 w-5" onclick={() => onRemove(idx)}>
			<Trash2 class="h-3 w-3 text-red-500" />
		</Button>
	</div>
{/each}
