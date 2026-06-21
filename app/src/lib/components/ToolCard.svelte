<script lang="ts">
	import type { ToolContent } from '$lib/types';
	import { ChevronRight } from '@lucide/svelte';

	let { tool }: { tool: ToolContent } = $props();
</script>

<article
	class="rounded-md shadow p-6 bg-gray-50 hover:scale-101 transition hover:shadow-md flex justify-center items-center active:scale-99 active:shadow"
>
	<div>
		<h3 class="font-klee text-xl my-1">{tool.name}</h3>
		<p class="text-sm text-gray-400 whitespace-pre-wrap">{tool.description}</p>
	</div>
	<ChevronRight class="text-gray-400 ml-auto" />
</article>
