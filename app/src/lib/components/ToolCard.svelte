<script lang="ts">
	import { goto } from '$app/navigation';
	import type { ToolContent } from '$lib/types';
	import { ChevronRight } from '@lucide/svelte';

	let { id, tool }: { id: string; tool: ToolContent } = $props();
</script>

<button
	onclick={() => goto(`/tools/${id}`)}
	class="button-animation rounded-md p-6 bg-gray-50 grid grid-cols-[1fr_auto] gap-2 justify-center items-center text-left w-full"
	><div>
		<h3 class=" font-medium my-1">{tool.tagline}</h3>
		<p class="text-xs text-gray-400 whitespace-pre-wrap">{tool.description}</p>
		<p class="text-sm mt-8 font-klee">{tool.name}</p>
	</div>
	<ChevronRight class="text-gray-400 ml-auto" />
</button>
