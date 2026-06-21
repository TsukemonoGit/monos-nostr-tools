<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import NeedCard from './NeedCard.svelte';
	import needsData from '$lib/data/needs.json';
	import { getLocale } from '$lib/paraglide/runtime';
	import toolsData from '$lib/data/tools.json';
	import type { NeedEntry } from '$lib/types';

	let locale = $derived(getLocale());

	const needs = needsData as NeedEntry[];
	const tools = toolsData as any;

	const toolList = needsData.map((need) => need.toolList);

	let displayList;

	const openModal = (need: NeedEntry) => {
		console.log(need.toolList);
	};
	// const toolListData = $derived(toolList.map((id) => tools?.[id]?.[locale]));
</script>

<section class="my-12">
	<h2 class="text-lg font-title3 font-bold myContainer">
		{m.needs_title()}
	</h2>
	<div class="myContainer flex gap-2 my-2">
		{#each needs as need}
			{@const needData = need?.[locale]}
			<NeedCard data={needData} onclick={() => openModal(need)} icon={need.icon} />
		{/each}
	</div>
</section>
