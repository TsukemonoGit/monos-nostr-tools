<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime';
	import type { ToolEntry } from '$lib/types';

	import Carousel from './Carousel.svelte';
	import { m } from '$lib/paraglide/messages';
	import DetailCard from './DetailCard.svelte';

	interface Props {
		tool: ToolEntry;
	}
	let { tool }: Props = $props();
	let locale = $derived(getLocale());
	let toolLocal = $derived(tool?.[locale]);
</script>

<h2 class="text-4xl font-klee myContainer mt-4">{toolLocal.name}</h2>

<p class="myContainer mt-2">{toolLocal.description}</p>
{#if tool.screenshots}
	<Carousel screenshots={tool.screenshots} />
{/if}
<DetailCard title={m.detail_whatFor()}>
	<ul class="list-disc list-inside mx-4 font-medium">
		{#each toolLocal.whatFor as li (li)}
			<li class="my-4">{li}</li>
		{/each}
	</ul>
</DetailCard>
