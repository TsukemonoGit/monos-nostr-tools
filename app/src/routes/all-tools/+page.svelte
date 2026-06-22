<script lang="ts">
	import tools from '$lib/data/tools.json';

	import { AUDIENCES } from '$lib/types';
	import type { AudienceI18n, ToolsMap } from '$lib/types';
	import audience_i18nData from '$lib/data/audience.json';
	import { getLocale } from '$lib/paraglide/runtime';
	import ToolCard from '$lib/components/ToolCard.svelte';

	const audience_i18n = audience_i18nData as AudienceI18n;

	let locale = $derived(getLocale());

	const grouped = Object.fromEntries(
		AUDIENCES.map((audience) => [
			audience,
			Object.entries(tools as ToolsMap)
				.map(([id, tool]) => ({
					id,
					...tool
				}))
				.filter((tool) => tool.audience === audience)
		])
	);
</script>

{#each AUDIENCES as audience}
	<section class="myContainer">
		<h2 class="font-title1">{audience_i18n[locale][audience]}</h2>

		<div class="flex gap-4">
			{#each grouped[audience] as tool (tool.id)}
				<ToolCard tool={tool[locale]} id={tool.id} />
			{/each}
		</div>
	</section>
{/each}
