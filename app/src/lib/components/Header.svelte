<script lang="ts">
	import LocaleSelect from './LocaleSelect.svelte';
</script>

<header class="font-klee z-10">
	<div class="myContainer py-2 flex justify-between">
		<a class="section-title text-xl" href={'/'}>Mono's Nostr Tools ･ᴗ･</a>
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
