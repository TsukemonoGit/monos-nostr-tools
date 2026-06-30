<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime';
	import type { LibraryEntry } from '$lib/types';

	import { m } from '$lib/paraglide/messages';
	import DetailCard from './DetailCard.svelte';

	interface Props {
		tool: LibraryEntry;
	}
	let { tool }: Props = $props();
	let locale = $derived(getLocale());
	let libraryLocal = $derived(tool?.i18n[locale]);
</script>

<h2 class="text-3xl font-klee font-bold myContainer mt-8 text-gray-900">{libraryLocal.name}</h2>

<p class="myContainer mt-2 text-gray-500 leading-relaxed">{libraryLocal.description}</p>

<DetailCard title={m.detail_install()}>
	<pre class="bg-gray-900 text-gray-100 rounded-md p-4 mx-4 overflow-x-auto text-sm"><code
			>{libraryLocal.install}</code
		></pre>
</DetailCard>

<DetailCard title={m.detail_example()}>
	<pre class="bg-gray-900 text-gray-100 rounded-md p-4 mx-4 overflow-x-auto text-sm"><code
			>{libraryLocal.example}</code
		></pre>
</DetailCard>

<DetailCard title={m.detail_features()}>
	<ul class="space-y-2 mx-4">
		{#each libraryLocal.features as feature (feature)}
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
		{#each libraryLocal.highlights as highlight (highlight)}
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

<DetailCard title={m.detail_api()}>
	<ul class="space-y-4 mx-4">
		{#each libraryLocal.api as entry (entry.name)}
			<li class="flex flex-col gap-1">
				<code class="text-sm font-mono text-gray-900 bg-gray-100 rounded px-1.5 py-0.5 w-fit"
					>{entry.name}</code
				>
				<span class="text-gray-700">{entry.description}</span>
			</li>
		{/each}
	</ul>
</DetailCard>

<DetailCard title={m.detail_whatsNew()}>
	<ul class="space-y-8 mx-4 mb-6">
		{#each libraryLocal.whatsNew as entry (`${entry.date}-${entry.title}`)}
			<li class="flex items-baseline gap-3 flex-wrap">
				<span class="text-xs font-medium text-gray-600 bg-gray-50 rounded py-0.5 shrink-0"
					>{entry.date}</span
				>
				<span class="text-gray-700">{entry.title}</span>
			</li>
		{/each}
	</ul>
</DetailCard>
