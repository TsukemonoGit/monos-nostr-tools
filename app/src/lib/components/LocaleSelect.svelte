<script lang="ts">
	import { locales, setLocale, getLocale } from '$lib/paraglide/runtime';
</script>

<nav>
	{#each locales as locale}
		<button onclick={() => setLocale(locale)} disabled={getLocale() === locale}>
			{locale}
		</button>
	{/each}
</nav>
