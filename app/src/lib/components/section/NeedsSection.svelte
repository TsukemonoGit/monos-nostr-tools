<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import NeedCard from '$lib/components/NeedCard.svelte';
	import needsData from '$lib/data/needs.json';
	import { getLocale } from '$lib/paraglide/runtime';
	import toolsData from '$lib/data/tools.json';
	import type { NeedEntry, ToolsMap } from '$lib/types';
	import NeedModal from '$lib/components/NeedModal.svelte';

	let locale = $derived(getLocale());
	let needModalOpen = $state(false);

	const needs = needsData as NeedEntry[];

	let displayNeed: NeedEntry | null = $state(null);

	const openModal = (need: NeedEntry) => {
		console.log(need.toolList);
		displayNeed = need;
		needModalOpen = true;
	};
	// const toolListData = $derived(toolList.map((id) => tools?.[id]?.[locale]));
</script>

<section class="my-20">
	<h2 class="text-lg font-title3 font-bold myContainer">
		{m.needs_title()}
	</h2>
	<div class="myContainer grid md:grid-cols-2 grid-cols-1 gap-4 my-2">
		{#each needs as need}
			{@const needData = need?.[locale]}
			<NeedCard data={needData} onclick={() => openModal(need)} icon={need.icon} />
		{/each}
	</div>
</section>

<NeedModal need={displayNeed} bind:open={needModalOpen} />
