<script lang="ts">
	import type { NeedContent } from '$lib/types';
	import type { MouseEventHandler } from 'svelte/elements';

	let { data, onclick }: { data: NeedContent; onclick: MouseEventHandler<HTMLElement> } = $props();
</script>

<article class="rounded-md shadow-md bg-gray-50 p-4" {onclick}>
	<h3>{data.title}</h3>
</article>
