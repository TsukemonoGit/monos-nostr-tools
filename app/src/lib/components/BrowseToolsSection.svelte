<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { ChevronRight } from '@lucide/svelte';
</script>

<section class="flex flex-row-reverse myContainer my-8">
	<button
		class="flex font-bold text-gray-700 rounded-full bg-gray-300 transition hover:scale-102 active:scale-98 py-2 gap-2 px-4 items-center"
		onclick={() => {}}
		>{m.browseTools()}
		<div class="rounded-full bg-gray-400 p-1 flex justify-center">
			<ChevronRight class=" text-gray-50/80 ml-auto" />
		</div></button
	>
</section>
