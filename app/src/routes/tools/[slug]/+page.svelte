<script lang="ts">
	import { page } from '$app/state';
	import ExtensionTool from '$lib/components/tool/ExtensionTool.svelte';
	import LibraryTool from '$lib/components/tool/LibraryTool.svelte';
	import WebAppTool from '$lib/components/tool/WebAppTool.svelte';

	import toolsData from '$lib/data/tools.json';
	import type { ToolsMap } from '$lib/types';

	const tools = toolsData as ToolsMap;

	const category = tools[page.params.slug ?? '']?.category;
</script>

{#if category}
	{#if category === 'webapp'}
		<WebAppTool />
	{:else if category === 'library'}
		<LibraryTool />
	{:else if category == 'extension'}
		<ExtensionTool />
	{:else}
		atode
	{/if}
{/if}
