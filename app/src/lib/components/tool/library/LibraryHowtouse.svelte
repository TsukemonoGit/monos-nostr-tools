<script lang="ts">
	import { browser } from '$app/env';
	import { m } from '$lib/paraglide/messages';
	import { md } from '$lib/utils/utils';
	import DetailCard from '../DetailCard.svelte';

	let { howtouse }: { howtouse: string } = $props();

	let markedHowtouse = $derived(md.render(howtouse));
</script>

{#if browser}
	<DetailCard title={m.detail_how_to_use()}>
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		<div class="lib-how">{@html markedHowtouse}</div>
	</DetailCard>{/if}

<style lang="postcss">
	@reference "tailwindcss";
	.lib-how :global(pre) {
		@apply overflow-x-auto rounded-md bg-gray-200 p-6 text-sm text-gray-900;
	}

	.lib-how :global(h2) {
		@apply mt-6 mb-2 font-bold text-gray-800;
	}
</style>
