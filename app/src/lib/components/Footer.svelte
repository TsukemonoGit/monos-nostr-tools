<script lang="ts">
	import { PencilSparkles } from '@lucide/svelte';
</script>

<footer class="font-maru h-60">
	<div class="myContainer">Footer フッター font-maru ₍ ･ᴗ･ ₎</div>
	{#if import.meta.env.DEV}
		<a
			href={'/gui'}
			class="m-2 flex items-center gap-2 font-bold bg-gray-400 w-fit rounded-full px-4 py-2 button-animation"
			><PencilSparkles />Edit</a
		>
	{/if}
</footer>

<style lang="postcss">
	@reference "tailwindcss";
	footer {
		color: theme(--color-gray-50);
		width: 100%;
		background-color: theme(--color-gray-700);
	}
</style>
