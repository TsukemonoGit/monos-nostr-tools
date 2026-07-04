<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { ApiEntry, RelatedLink } from '$lib/types';
	import { ExternalLink } from '@lucide/svelte';
	import DetailCard from '../DetailCard.svelte';

	let { apis, link }: { apis: ApiEntry[]; link?: RelatedLink } = $props();
</script>

<DetailCard title={m.detail_api()}>
	<ul class="space-y-4 mx-4">
		{#each apis as entry (entry.name)}
			<li class="flex flex-col gap-1">
				<code class="text-sm font-mono text-gray-900 bg-gray-100 rounded px-1.5 py-0.5 w-fit"
					>{entry.name}</code
				>
				<span class="text-gray-700">{entry.description}</span>
			</li>
		{/each}

		{#if link && link.type === 'docs' && link.url}
			<li>
				<a
					href={link.url}
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm text-gray-600 hover:underline flex items-center gap-1 justify-end"
				>
					API Docs<ExternalLink class="mb-1" size={16} />
				</a>
			</li>
		{/if}
	</ul>
</DetailCard>
