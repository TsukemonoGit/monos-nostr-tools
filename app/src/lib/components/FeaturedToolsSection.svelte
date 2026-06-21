<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import ToolCard from './ToolCard.svelte';
	import toolsData from '$lib/data/tools.json';
	import featuredData from '$lib/data/features.json';
	import type { ToolContent } from '$lib/types';

	let locale = $derived(getLocale());

	const featured = featuredData as string[];
	const tools = toolsData as any;
	let featuredi18n: ToolContent[] = $derived(featured.map((id) => tools?.[id]?.[locale]));
</script>

<section class="my-12">
	<h2 class="text-lg font-title3 font-bold myContainer">
		{m.featured_title()}
	</h2>
	<div class="myContainer flex gap-2">
		{#each featuredi18n as tool}
			<ToolCard {...tool} />
		{/each}
	</div>
</section>
