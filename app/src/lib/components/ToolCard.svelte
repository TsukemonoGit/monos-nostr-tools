<script lang="ts">
	import { goto } from '$app/navigation';
	import type { ToolContent } from '$lib/types';
	import { ChevronRight } from '@lucide/svelte';

	let { id, tool }: { id: string; tool: ToolContent } = $props();
</script>

<button
	onclick={() => goto(`/tools/${id}`)}
	class="button-animation  rounded-md  p-6 bg-gray-50  flex justify-center items-center  text-left"
	><div>
		<h3 class="font-klee text-xl my-1">{tool.name}</h3>
		<p class="text-sm text-gray-400 whitespace-pre-wrap">{tool.description}</p>
	</div>
	<ChevronRight class="text-gray-400 ml-auto" />
</button>
