<script lang="ts">
	import { page } from '$app/state';
	import ExtensionTool from '$lib/components/tool/ExtensionTool.svelte';
	import LibraryTool from '$lib/components/tool/LibraryTool.svelte';
	import WebAppTool from '$lib/components/tool/WebAppTool.svelte';

	import toolsData from '$lib/data/tools.json';
	import type { ToolsMap } from '$lib/types';

	const tools = toolsData as ToolsMap;
	const tool = tools[page.params.slug ?? ''];
	const category = tool?.category;
</script>

{#if category}
	{#if category === 'webapp'}
		<WebAppTool {tool} />
	{:else if category === 'library'}
		<LibraryTool {tool} />
	{:else if category == 'extension'}
		<ExtensionTool {tool} />
	{:else}
		atode
	{/if}
{/if}
