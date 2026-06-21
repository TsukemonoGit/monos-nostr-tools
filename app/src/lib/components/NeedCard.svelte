<script lang="ts">
	import type { NeedContent } from '$lib/types';
	import type { MouseEventHandler } from 'svelte/elements';
	import * as icons from '@lucide/svelte';

	let {
		data,
		onclick,
		icon
	}: { data: NeedContent; onclick: MouseEventHandler<HTMLElement>; icon: string } = $props();

	let Icon = $derived.by(() => {
		if (!icon) return null;
		try {
			return (icons as any)[icon];
		} catch {
			return null;
		}
	});
</script>

<article class="rounded-md shadow-md bg-gray-50 p-6 flex items-center gap-2" {onclick}>
	{#if Icon}<Icon />{/if}
	<h3>{data.title}</h3>
</article>
