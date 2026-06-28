<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title: string;
		children: Snippet;
	}
	let { title, children }: Props = $props();
</script>

<section class="myContainer">
	<div class=" rounded-md shadow px-4 py-8 sm:px-8 my-4 bg-gray-50">
		<h3 class="text-xl section-title text-gray-700">{title}</h3>
		<div class="mt-4">
			{@render children?.()}
		</div>
	</div>
</section>
