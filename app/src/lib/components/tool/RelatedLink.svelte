<script lang="ts">
	import { getLocale } from '$lib/paraglide/runtime';
	import type { RelatedLink, ToolsMap } from '$lib/types';
	import {
		Book,
		CodeXml,
		ExternalLink,
		HeartHandshake,
		LayoutGrid,
		Presentation
	} from '@lucide/svelte';
	import LinkCard from './LinkCard.svelte';
	import toolsData from '$lib/data/tools.json';
	interface Props {
		relatedLink: RelatedLink;
	}

	let { relatedLink }: Props = $props();
	let locale = $derived(getLocale());
	const tools = toolsData as ToolsMap;
</script>

{#if relatedLink.type === 'source'}
	<LinkCard title="Source Code" description="" link={relatedLink.url!} Icon={CodeXml} />
{:else if relatedLink.type === 'docs'}
	<LinkCard title="Documentation" description="" link={relatedLink.url!} Icon={Book} />
{:else if relatedLink.type === 'slides'}
	<LinkCard
		title="Presentation Slides"
		description=""
		link={relatedLink.url!}
		Icon={Presentation}
	/>
{:else if relatedLink.type === 'publication'}
	<LinkCard title="Publication" description="" link={relatedLink.url!} Icon={Book} />
{:else if relatedLink.type === 'support'}
	<LinkCard title="Support" description="" link={relatedLink.url!} Icon={HeartHandshake} />
{:else if relatedLink.type === 'related-tool'}
	{@const tool = tools?.[relatedLink.toolId!]?.i18n[locale]}
	<LinkCard
		external={false}
		title={tool.name}
		description={tool.tagline}
		link={`./tools/${relatedLink.toolId}`}
		Icon={LayoutGrid}
	/>
{:else}
	{@const content = relatedLink.i18n?.[locale]}
	<LinkCard
		title={content!.title}
		description={content!.description ?? ''}
		link={relatedLink.url!}
		Icon={ExternalLink}
	/>
{/if}
