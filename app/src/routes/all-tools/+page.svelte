<script lang="ts">
	import tools from '$lib/data/tools.json';

	import { AUDIENCES } from '$lib/types';
	import type { AudienceI18n, ToolsMap, Tool, Audience } from '$lib/types';
	import audience_i18nData from '$lib/data/audience.json';
	import { getLocale } from '$lib/paraglide/runtime';
	import ToolCard from '$lib/components/ToolCard.svelte';

	const audience_i18n = audience_i18nData as AudienceI18n;

	let locale = $derived(getLocale());

	type ToolWithId = Tool & { id: string };

	const grouped: Record<Audience, ToolWithId[]> = Object.fromEntries(
		AUDIENCES.map((audience) => [
			audience,
			Object.entries(tools as ToolsMap)
				.map(([id, tool]): ToolWithId => ({ id, ...tool }))
				.filter((tool) => tool.audience === audience)
		])
	) as Record<Audience, ToolWithId[]>;
</script>

{#each AUDIENCES as audience (audience)}
	<section class="myContainer">
		<h2 class="font-title1">{audience_i18n[locale][audience]}</h2>

		<div class="flex gap-4 flex-col">
			{#each grouped[audience] as tool (tool.id)}
				<ToolCard tool={tool.i18n[locale]} id={tool.id} />
			{/each}
		</div>
	</section>
{/each}
