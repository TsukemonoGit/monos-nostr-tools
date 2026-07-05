<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { X } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		onCancel: () => void;
		onSave: () => void;
		cancelLabel?: string;
		saveLabel?: string;
		children: Snippet;
	}

	let {
		title,
		onCancel,
		onSave,
		cancelLabel = 'Cancel',
		saveLabel = 'Save',
		children
	}: Props = $props();
</script>

<div class="bg-muted/50 p-4 rounded-lg space-y-4">
	<div class="flex items-center justify-between">
		<span class="font-bold">{title}</span>
		<Button variant="ghost" size="icon" onclick={onCancel}>
			<X class="h-4 w-4" />
		</Button>
	</div>

	<div class="content">{@render children()}</div>

	<div class="flex gap-2 justify-end">
		<Button variant="outline" onclick={onCancel}>{cancelLabel}</Button>
		<Button onclick={onSave}>{saveLabel}</Button>
	</div>
</div>
