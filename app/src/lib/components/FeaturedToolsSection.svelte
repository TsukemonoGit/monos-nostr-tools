<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { ToolData } from '$lib/types';
	import ToolCard from './ToolCard.svelte';

	const tools: ToolData[] = [
		{
			name: 'Lumilumi',
			description: 'Nostr Client',
			id: 'lumilumi' //href
		}
	];
</script>

<section class="my-12">
	<h2 class="text-xl font-title3 font-bold myContainer">
		{m.featured_title()}
	</h2>
	<div class="myContainer flex gap-2">
		{#each tools as tool}
			<ToolCard {...tool} />
		{/each}
	</div>
</section>
