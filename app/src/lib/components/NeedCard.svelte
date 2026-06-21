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

<button
	class="rounded-md shadow bg-gray-50 p-6 flex items-center gap-2 hover:scale-101 transition hover:shadow-md w-full active:scale-99 active:shadow"
	{onclick}
>
	{#if Icon}<Icon />{/if}
	<h3>{data.title}</h3>
	<ChevronRight class="text-gray-400 ml-auto" />
</button>
