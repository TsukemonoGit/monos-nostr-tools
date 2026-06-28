<script lang="ts">
	import type { FaqEntry } from '$lib/types';
	import { ChevronDown } from '@lucide/svelte';
	import { getLocale } from '$lib/paraglide/runtime';
	import { slide } from 'svelte/transition';
	interface Props {
		faqs: FaqEntry[];
	}
	let { faqs }: Props = $props();

	let locale = $derived(getLocale());
	let openIndex = $state<number | null>(null);

	const toggleFaq = (index: number) => {
		openIndex = openIndex === index ? null : index;
	};
</script>

{#each faqs as faq, index (faq.id)}
	{@const content = faq?.[locale]}
	<div class="w-full">
		<button
			class="flex items-center justify-between w-full py-4 px-6 text-left rounded-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
			onclick={() => toggleFaq(index)}
		>
			<span class=" font-medium pr-4">{content.question}</span>
			<span class="shrink-0 text-gray-500">
				<ChevronDown class={`${openIndex === index ? 'rotate-180' : ''} transition-all `} />
			</span>
		</button>
		{#if openIndex === index}
			<div
				class="mx-7 px-4 mb-4 border-l-2 border-gray-500 text-gray-600 dark:text-gray-300"
				transition:slide={{ duration: 200 }}
			>
				<p>{content.answer}</p>
			</div>
		{/if}
	</div>
{/each}
