<script lang="ts">
	import { m } from '$lib/paraglide/messages';

	import type { FaqEntry } from '$lib/types';
	import faqData from '$lib/data/faq.json';

	import FaqAccordion from './FaqAccordion.svelte';

	const faqs = faqData as FaqEntry[];
</script>

<section class="my-20">
	<h2 class="text-2xl section-title myContainer">
		{m.faq_title()}
	</h2>
	<div class="myContainer">
		<FaqAccordion {faqs} />
	</div>
</section>
