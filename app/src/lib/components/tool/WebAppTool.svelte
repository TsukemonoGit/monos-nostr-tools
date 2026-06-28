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

<h2 class="text-3xl font-klee font-bold myContainer mt-8 text-gray-900">{toolLocal.name}</h2>

<p class="myContainer mt-2 text-gray-500 leading-relaxed">{toolLocal.description}</p>

{#if tool.screenshots}
	<Carousel screenshots={tool.screenshots} />
{/if}

<DetailCard title={m.detail_features()}>
	<ul class="space-y-2 mx-4">
		{#each toolLocal.features as feature (feature)}
			<li class="flex items-start gap-2.5 text-gray-700">
				<svg
					class="size-4 mt-0.5 text-gray-500 shrink-0"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clip-rule="evenodd"
					/>
				</svg>
				<span>{feature}</span>
			</li>
		{/each}
	</ul>
</DetailCard>

<DetailCard title={m.detail_highlights()}>
	<ul class="space-y-2 mx-4">
		{#each toolLocal.highlights as highlight (highlight)}
			<li class="flex items-start gap-2.5 text-gray-700">
				<svg
					class="size-4 mt-0.5 text-gray-500 shrink-0"
					viewBox="0 0 20 20"
					fill="currentColor"
					aria-hidden="true"
				>
					<path
						fill-rule="evenodd"
						d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
						clip-rule="evenodd"
					/>
				</svg>
				<span>{highlight}</span>
			</li>
		{/each}
	</ul>
</DetailCard>

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
