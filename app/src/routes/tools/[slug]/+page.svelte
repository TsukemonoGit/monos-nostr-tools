<script lang="ts">
	import { page } from '$app/state';
	
	import toolsData from '$lib/data/tools.json';
	import type { ToolsMap } from '$lib/types';

const tools = toolsData as ToolsMap;
</script>

{#if tools[page.params.slug??""].category}
{#if tools[page.params.slug??""].category==="webapp"}
webappdayo
{:else}
atode
{/if}
{/if}