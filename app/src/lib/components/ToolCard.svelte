<script lang="ts">
	import type { ToolContent } from '$lib/types';

	let { name, description }: ToolContent = $props();
</script>

<article class="rounded-md shadow-md p-4 bg-gray-50">
	<h3>{name}</h3>
	<p>{description}</p>
</article>
