<script lang="ts">
	import type { NeedData } from '$lib/types';

	let { data }: { data: NeedData } = $props();
</script>

<article class="rounded-md shadow-md bg-gray-50 p-4">
	<h3>{data.title}</h3>
	<p>{data.description}</p>
</article>
