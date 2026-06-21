<script lang="ts">
	import type { ToolData } from '$lib/types';

	let { name, description }: ToolData = $props();
</script>

<article class="rounded-md shadow-md p-4">
	<h3>{name}</h3>
	<p>{description}</p>
</article>
