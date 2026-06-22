<script lang="ts">
	import { goto } from '$app/navigation';
	import { m } from '$lib/paraglide/messages';
	import { ChevronRight } from '@lucide/svelte';
</script>

<section class="flex flex-row-reverse myContainer my-8">
	<button
		class="button-animation flex font-bold text-gray-700 rounded-full bg-gray-300  py-2 gap-2 px-4 items-center"
		onclick={() => goto('/all-tools')}
		>{m.browseTools()}
		<div class="rounded-full bg-gray-400 p-1 flex justify-center  ">
			<ChevronRight class=" text-gray-50/80 ml-auto" />
		</div></button
	>
</section>
