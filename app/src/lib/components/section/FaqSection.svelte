<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { getLocale } from '$lib/paraglide/runtime';
	import { slide } from 'svelte/transition';
	import type { FaqEntry } from '$lib/types';
	import faqData from '$lib/data/faq.json';

	let locale = $derived(getLocale());

	const faqs = faqData as FaqEntry[];

	let openIndex = $state<number | null>(null);

	const toggleFaq = (index: number) => {
		openIndex = openIndex === index ? null : index;
	};
</script>

<section class="my-20">
	<h2 class="text-2xl section-title myContainer">
		{m.faq_title()}
	</h2>
	<div class="myContainer">
		{#each faqs as faq, index (faq.id)}
			{@const content = faq?.[locale]}
			<div class="border-b border-gray-200 dark:border-gray-700">
				<button
					class="flex items-center justify-between w-full py-4 px-6 text-left rounded-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
					onclick={() => toggleFaq(index)}
				>
					<span class="text-lg font-medium pr-4">{content.question}</span>
					<span class="text-2xl flex-shrink-0">
						{#if openIndex === index}
							−
						{:else}
							+
						{/if}
					</span>
				</button>
				{#if openIndex === index}
					<div
						class="px-6 pb-4 text-gray-600 dark:text-gray-300"
						transition:slide={{ duration: 200 }}
					>
						<p>{content.answer}</p>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</section>
