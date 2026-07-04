<script lang="ts">
	import { browser } from '$app/env';
	import { m } from '$lib/paraglide/messages';
	import { md } from '$lib/utils/utils';
	import DetailCard from './DetailCard.svelte';

	let { highlights }: { highlights: string } = $props();
	let highlightsMd = $derived(md.render(highlights));
</script>

{#if browser}
	<DetailCard title={m.detail_highlights()}>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<div class="lib-highlights">{@html highlightsMd}</div>
	</DetailCard>{/if}

<style lang="postcss">
	@reference "tailwindcss";
	.lib-highlights :global(h2) {
		@apply mt-6 mb-4 text-lg font-bold;
	}
	.lib-highlights :global(h3) {
		@apply mt-6 mb-4 font-bold;
	}

	.lib-highlights :global(hr) {
		@apply my-2;
	}

	.lib-highlights :global(ul) {
		@apply mx-4 my-2 space-y-2;
		list-style: none;
		padding-left: 0;
	}

	.lib-highlights :global(li) {
		@apply relative pl-7 text-gray-700;
	}

	.lib-highlights :global(li)::before {
		content: '';
		@apply absolute top-1 left-0 size-4 bg-gray-500;

		mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='black'%3E%3Cpath fill-rule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clip-rule='evenodd'/%3E%3C/svg%3E")
			no-repeat center;
		mask-size: contain;
	}
</style>
