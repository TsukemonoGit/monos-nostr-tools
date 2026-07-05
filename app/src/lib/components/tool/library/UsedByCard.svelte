<script lang="ts">
	import type { UsedByEntry } from '$lib/types';
	import { ExternalLink } from '@lucide/svelte';

	interface Props {
		usedBy: UsedByEntry;
	}
	let { usedBy }: Props = $props();
</script>

<a
	href={usedBy.url}
	class="rounded-md bg-gray-100 button-animation grid grid-cols-[1fr_auto] gap-4 p-4"
>
	<div class="flex flex-col">
		<h3 class="text-lg">{usedBy.title}</h3>
		{#if usedBy.author}<div class="flex gap-1 text-gray-500 text-sm">
				by<nostr-profile user={usedBy.author} display="name"></nostr-profile>
			</div>{/if}
	</div>

	<ExternalLink class="text-gray-400 my-auto" />
</a>
