<script lang="ts">
	import LocaleSelect from './LocaleSelect.svelte';
</script>

<header class="font-klee">
	<div class="myContainer py-2 flex justify-between">
		<h1 class="font-title3 text-xl">Mono's Nostr Tools ･ᴗ･</h1>
		<LocaleSelect />
	</div>
</header>

<style lang="postcss">
	@reference "tailwindcss";
	header {
		position: sticky;
		top: 0;
		color: theme(--color-gray-50);
		width: 100%;
		background-color: theme(--color-gray-700);
	}
</style>
