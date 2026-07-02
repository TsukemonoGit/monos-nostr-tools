<script lang="ts">
	import { goto } from '$app/navigation';
	import { getLocale } from '$lib/paraglide/runtime';
	import type { Tool } from '$lib/types';
	import { ChevronRight } from '@lucide/svelte';

	let { id, tool }: { id: string; tool: Tool } = $props();
	let locale = $derived(getLocale());
	let content = $derived(tool.i18n?.[locale]);
</script>

<button
	onclick={() => goto(`/tools/${id}`)}
	class="button-animation rounded-md p-6 bg-gray-50 grid grid-cols-[1fr_auto] justify-center items-center text-left w-full"
>
	<div class="relative">
		<div class="absolute bottom-0 right-0 z-0 opacity-50">
			{#if tool.icon}
				<img loading="lazy" width={64} height={64} src={tool.icon} alt={id} />{:else}{/if}
		</div>
		<h3 class=" font-medium my-1 text-lg z-10">{content.tagline}</h3>
		<p class="text-xs text-gray-400 whitespace-pre-wrap">{content.description}</p>
		<p class="text-sm mt-8 font-klee">{content.name}</p>
	</div>
	<ChevronRight class="text-gray-400 ml-auto" />
</button>
