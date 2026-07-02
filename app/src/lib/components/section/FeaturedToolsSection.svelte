<script lang="ts">
	import { m } from '$lib/paraglide/messages';

	import ToolCard from '$lib/components/ToolCard.svelte';
	import toolsData from '$lib/data/tools.json';
	import featuredData from '$lib/data/features.json';
	import type { ToolsMap } from '$lib/types';

	const featured = featuredData as string[];
	const tools = toolsData as ToolsMap;
</script>

<section class="my-20">
	<h2 class="text-2xl section-title myContainer">
		{m.featured_title()}
	</h2>
	<div class="myContainer grid md:grid-cols-2 grid-cols-1 gap-4 my-4">
		{#each featured as id (id)}
			<ToolCard {id} tool={tools?.[id]} />
		{/each}
	</div>
</section>
