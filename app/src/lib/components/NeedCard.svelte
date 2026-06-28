<script lang="ts">
	import type { NeedContent } from '$lib/types';
	import type { MouseEventHandler } from 'svelte/elements';
	import { getIcon } from '$lib/utils/utils';
	import { ChevronRight } from '@lucide/svelte';

	let {
		data,
		onclick,
		icon
	}: { data: NeedContent; onclick: MouseEventHandler<HTMLElement>; icon: string } = $props();

	let Icon = $derived(getIcon(icon));
</script>

<button class="button-animation rounded-md bg-gray-50 p-6 flex items-center gap-2 w-full" {onclick}>
	{#if Icon}<Icon />{/if}
	<h3 class="font-medium">{data.title}</h3>
	<ChevronRight class="text-gray-400 ml-auto" />
</button>
