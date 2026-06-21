<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { getLocale } from '$lib/paraglide/runtime';
	import type { NeedEntry, ToolsMap } from '$lib/types';
	import { getIcon } from '$lib/utils/utils';
	import ToolCard from './ToolCard.svelte';

	import toolsData from '$lib/data/tools.json';

	let { open = $bindable(), need }: { open: boolean; need: NeedEntry | null } = $props();

	const tools = toolsData as ToolsMap;

	let locale = $derived(getLocale());
	let toolList = $derived(need?.toolList);

	let needData = $derived(need?.[locale]);
	let Icon = $derived(getIcon(need?.icon || ''));
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-md p-6">
		{#if needData}
			<Dialog.Header>
				<Dialog.Title class="flex items-center gap-2 py-2"
					>{#if Icon}<Icon />{/if}{needData.title}</Dialog.Title
				>
			</Dialog.Header>
			<div class="flex items-center gap-2">
				<div class="grid flex-1 gap-2">
					{#each toolList as toolname}
						<ToolCard tool={tools[toolname]?.[locale]} />
					{/each}
				</div>
			</div>
			<Dialog.Footer class="sm:justify-start">
				<Dialog.Close class={buttonVariants({ variant: 'secondary' })}>Close</Dialog.Close>
			</Dialog.Footer>{/if}
	</Dialog.Content>
</Dialog.Root>
