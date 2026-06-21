<script lang="ts">
	import type { ToolContent } from '$lib/types';

	let { tool }: { tool: ToolContent } = $props();
</script>

<article class="rounded-md shadow-md p-6 bg-gray-50">
	<h3 class="font-klee text-xl my-1">{tool.name}</h3>
	<p class="text-sm text-gray-400 whitespace-pre-wrap">{tool.description}</p>
</article>
