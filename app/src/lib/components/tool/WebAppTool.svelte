<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime';
	import type { WebAppEntry } from '$lib/types';

	import Carousel from './Carousel.svelte';
	import { m } from '$lib/paraglide/messages';
	import DetailCard from './DetailCard.svelte';
	import Highlights from './Highlights.svelte';

	interface Props {
		tool: WebAppEntry;
	}
	let { tool }: Props = $props();
	let locale = $derived(getLocale());
	let toolLocal = $derived(tool?.i18n[locale]);
</script>

<h2 class="text-3xl font-klee font-bold myContainer mt-8 text-gray-900">{toolLocal.name}</h2>

<p class="myContainer mt-2 text-gray-600 leading-relaxed">{toolLocal.description}</p>

{#if tool.screenshots}
	<Carousel screenshots={tool.screenshots} />
{/if}

<Highlights highlights={toolLocal.highlights} />

<DetailCard title={m.detail_whatsNew()}>
	<ul class="space-y-8 mx-4 mb-6">
		{#each toolLocal.whatsNew as entry (`${entry.date}-${entry.title}`)}
			<li class="flex items-baseline gap-3 flex-wrap">
				<span class="text-xs font-medium text-gray-600 bg-gray-50 rounded py-0.5 shrink-0"
					>{entry.date}</span
				>
				<span class="text-gray-700">{entry.title}</span>
			</li>
		{/each}
	</ul>
</DetailCard>
