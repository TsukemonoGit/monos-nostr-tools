<script lang="ts">
	import { m } from '$lib/paraglide/messages';

	import type { FaqEntry } from '$lib/types';
	import faqData from '$lib/data/faq.json';

	import FaqAccordion from './FaqAccordion.svelte';

	const faqs = faqData as FaqEntry[];
</script>

<section class="my-20 myContainer" id="faq">
	<h2 class="text-2xl section-title">
		{m.faq_title()}
	</h2>
	<div
		class="mt-4 divide-y divide-gray-500/20 bg-gray-50 p-6 flex flex-col items-center gap-2 w-full rounded-md"
	>
		<FaqAccordion {faqs} />
	</div>
</section>
