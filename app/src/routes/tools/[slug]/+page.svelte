<script lang="ts">
	import { page } from '$app/state';
	import ExtensionTool from '$lib/components/tool/ExtensionTool.svelte';
	import LibraryTool from '$lib/components/tool/LibraryTool.svelte';
	import WebAppTool from '$lib/components/tool/WebAppTool.svelte';
	import FaqAccordion from '$lib/components/section/FaqAccordion.svelte';

	import toolsData from '$lib/data/tools.json';
	import type { ToolsMap } from '$lib/types';
	import { ChevronRight } from '@lucide/svelte';
	import { m } from '$lib/paraglide/messages';
	import DetailCard from '$lib/components/tool/DetailCard.svelte';
	const tools = toolsData as ToolsMap;
	const tool = tools[page.params.slug ?? ''];
	const category = tool?.category;
</script>

<a
	href={tool.websiteUrl}
	target="_blank"
	rel="noopener noreferrer"
	title={tool.websiteUrl}
	class="button-animation sticky top-16 myContainer float-end rounded-full pl-4 pr-2 py-1 bg-gray-700 text-gray-50 flex font-bold gap-2 items-center hover:opacity-90 opacity-60 m-4 text-sm z-10"
	>Try Now
	<div class="rounded-full bg-gray-900 p-1 flex justify-center shadow-sm">
		<ChevronRight class=" text-gray-200 ml-auto" />
	</div></a
>
{#if category}
	{#if category === 'webapp'}
		<WebAppTool {tool} />
	{:else if category === 'library'}
		<LibraryTool {tool} />
	{:else if category === 'extension'}
		<ExtensionTool {tool} />
	{:else}
		atode
	{/if}

	<DetailCard title="FAQ">
		<div class=" divide-y divide-gray-500/20 bg-gray-50 flex flex-col items-center gap-2 w-full">
			<FaqAccordion faqs={tool.faqs} />
		</div>

		<a
			href="/#faq"
			class=" w-fit ml-auto p-2 flex items-center gap-2 pl-4 mt-8 border-b border-b-gray-700 button-animation"
		>
			{m.faq_main()}

			<ChevronRight class="text-gray-500" />
		</a>
	</DetailCard>
{/if}
