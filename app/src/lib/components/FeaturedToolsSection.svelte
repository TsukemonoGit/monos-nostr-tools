<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import ToolCard from './ToolCard.svelte';
	import toolsData from '$lib/data/tools.json';
	import featuredData from '$lib/data/features.json';
	import type { ToolContent, ToolsMap } from '$lib/types';

	let locale = $derived(getLocale());

	const featured = featuredData as string[];
	const tools = toolsData as ToolsMap;
	let featuredi18n: ToolContent[] = $derived(featured.map((id) => tools?.[id]?.[locale]));
</script>

<section class="my-18">
	<h2 class="text-lg font-title3 font-bold myContainer">
		{m.featured_title()}
	</h2>
	<div class="myContainer grid md:grid-cols-2 grid-cols-1 gap-4">
		{#each featured as id}
			{@const tool = tools?.[id]?.[locale]}
			<ToolCard {id} {tool} />
		{/each}
	</div>
</section>
