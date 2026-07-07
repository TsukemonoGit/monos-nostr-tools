<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime';
	import type { LibraryEntry } from '$lib/types';

	import { m } from '$lib/paraglide/messages';
	import DetailCard from './DetailCard.svelte';
	import LibraryInstall from './library/LibraryInstall.svelte';
	import LibraryHowtouse from './library/LibraryHowtouse.svelte';
	import Highlights from './Highlights.svelte';
	import UsedByCard from './library/UsedByCard.svelte';

	interface Props {
		tool: LibraryEntry;
	}
	let { tool }: Props = $props();
	let locale = $derived(getLocale());
	let libraryLocal = $derived(tool?.i18n[locale]);
</script>

<h2 class="text-3xl font-klee font-bold myContainer mt-8 text-gray-900">{libraryLocal.name}</h2>

<p class="myContainer mt-2 text-gray-600 leading-relaxed">{libraryLocal.description}</p>

{#if libraryLocal.install}
	<LibraryInstall install={libraryLocal.install} />
{/if}

{#if libraryLocal.howtouse}
	<LibraryHowtouse howtouse={libraryLocal.howtouse} />
{/if}
{#if libraryLocal.highlights}
	<Highlights highlights={libraryLocal.highlights} />
{/if}
{#if libraryLocal.whatsNew.length > 0}
	<DetailCard title={m.detail_whatsNew()}>
		<ul class="space-y-8 mx-4 mb-6">
			{#each libraryLocal.whatsNew as entry (`${entry.date}-${entry.title}`)}
				<li class="flex items-baseline gap-3 flex-wrap">
					<span class="text-xs font-medium text-gray-700 bg-gray-50 rounded py-0.5 shrink-0"
						>{entry.date}</span
					>
					<span>{entry.title}</span>
				</li>
			{/each}
		</ul>
	</DetailCard>
{/if}
{#if tool.usedBy.length > 0}
	<DetailCard title={'Used By'}>
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-wrap">
			{#each tool.usedBy as usedBy (usedBy.title)}
				<UsedByCard {usedBy} />
			{/each}
		</div>
	</DetailCard>{/if}
