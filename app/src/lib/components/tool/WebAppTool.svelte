<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime';
	import type { ToolEntry } from '$lib/types';
	import { ChevronRight } from '@lucide/svelte';
	import Carousel from './Carousel.svelte';

	interface Props {
		tool: ToolEntry;
	}
	let { tool }: Props = $props();
	let locale = $derived(getLocale());
	let toolLocal = $derived(tool?.[locale]);
</script>

<button
	class="button-animation sticky top-12 myContainer float-end rounded-full pl-4 pr-2 py-1 bg-gray-700 text-gray-50 flex font-bold gap-2 items-center hover:opacity-90 opacity-60 m-4"
	>Try Now
	<div class="rounded-full bg-gray-400 p-1 flex justify-center shadow-sm">
		<ChevronRight class=" text-gray-50 ml-auto" />
	</div></button
>
<h2 class="text-3xl font-klee myContainer">{toolLocal.name}</h2>

<p class="myContainer mt-2">{toolLocal.description}</p>
<Carousel screenshots={tool.screenshots} />
