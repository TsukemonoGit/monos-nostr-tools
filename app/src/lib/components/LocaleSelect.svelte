<script lang="ts">
	import { locales, setLocale, getLocale } from '$lib/paraglide/runtime';
</script>

<nav class="divide-x divide-gray-500 flex items-center text-gray-300">
	{#each locales as locale}
		<button
			class="px-2 disabled:text-gray-500"
			onclick={() => setLocale(locale)}
			disabled={getLocale() === locale}
		>
			{locale}
		</button>
	{/each}
</nav>
