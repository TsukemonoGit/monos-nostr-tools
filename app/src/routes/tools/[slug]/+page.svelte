<script lang="ts">
	import { page } from '$app/state';
	import ExtensionTool from '$lib/components/tool/ExtensionTool.svelte';
	import LibraryTool from '$lib/components/tool/LibraryTool.svelte';
	import WebAppTool from '$lib/components/tool/WebAppTool.svelte';
	import FaqAccordion from '$lib/components/section/FaqAccordion.svelte';

	import toolsData from '$lib/data/tools.json';

	import { ChevronRight } from '@lucide/svelte';
	import { m } from '$lib/paraglide/messages';
	import DetailCard from '$lib/components/tool/DetailCard.svelte';
	import RelatedLink from '$lib/components/tool/RelatedLink.svelte';
	import type { Tool } from '$lib/types';

	// 1. Record<string, Tool>（ToolsMap）にする
	const tools = toolsData as Record<string, Tool>;
	let tool = $derived(tools[page.params.slug ?? '']);
</script>

<!-- 2. tool の存在を先にチェック -->
{#if tool}
	<a
		href={tool.websiteUrl}
		target="_blank"
		rel="noopener noreferrer"
		title={tool.websiteUrl}
		class="button-animation sticky top-16 myContainer float-end rounded-full pl-4 pr-2 py-1 bg-gray-700 text-gray-50 flex font-bold gap-2 items-center hover:opacity-90 opacity-60 m-4 text-sm z-10"
	>
		Try Now
		<div class="rounded-full bg-gray-900 p-1 flex justify-center shadow-sm">
			<ChevronRight class="text-gray-200 ml-auto" />
		</div>
	</a>

	<!-- 3. tool.category で直接分岐 → 各ブロック内で型が絞り込まれる -->
	{#if tool.category === 'webapp'}
		<WebAppTool {tool} />
	{:else if tool.category === 'library'}
		<LibraryTool {tool} />
	{:else if tool.category === 'extension'}
		<ExtensionTool {tool} />
	{:else}
		<!-- 到達不能。新しい category を追加した時にコンパイルエラーにしたい場合: -->
		<!-- {@const _exhaustive: never = tool.category} -->
		atode
	{/if}

	<!-- FAQ -->
	{#if tool.faqs.length > 0}
		<DetailCard title="FAQ">
			<div
				class="divide-y divide-gray-500/20 bg-gray-50 flex flex-col items-center gap-2 w-full -mt-2"
			>
				<FaqAccordion faqs={tool.faqs} />
			</div>

			<a
				href="/#faq"
				class="w-fit ml-auto p-2 flex items-center gap-2 pl-4 mt-8 border-b border-b-gray-700 button-animation"
			>
				{m.faq_main()}
				<ChevronRight class="text-gray-500" />
			</a>
		</DetailCard>
	{/if}
	{#if tool.relatedLinks.length > 0}
		<DetailCard title={m.links_title()}>
			<div class="flex flex-col gap-4">
				{#each tool.relatedLinks as link (link)}
					<RelatedLink relatedLink={link} />
				{/each}
			</div>
		</DetailCard>
	{/if}
{:else}
	<!-- 存在しないツールIDの場合 -->
	<div class="myContainer py-20 text-center text-gray-500">ツールが見つかりません</div>
{/if}
