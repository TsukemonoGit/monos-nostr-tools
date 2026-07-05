<script lang="ts">
	import { ChevronRight } from '@lucide/svelte';
	import { Button } from '$lib/components/ui/button';

	interface Props {
		onUp: () => void;
		onDown: () => void;
		disabledUp?: boolean;
		disabledDown?: boolean;
	}

	let { onUp, onDown, disabledUp = false, disabledDown = false }: Props = $props();
</script>

<div class="flex gap-0.5">
	<Button
		variant="ghost"
		size="icon"
		class="h-5 w-5"
		onclick={onUp}
		disabled={disabledUp}
		title="Move up"
	>
		<ChevronRight class="h-3 w-3 -rotate-90" />
	</Button>
	<Button
		variant="ghost"
		size="icon"
		class="h-5 w-5"
		onclick={onDown}
		disabled={disabledDown}
		title="Move down"
	>
		<ChevronRight class="h-3 w-3 rotate-90" />
	</Button>
</div>
