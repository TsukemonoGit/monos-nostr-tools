<script lang="ts">
	import type { ToolEntry } from '$lib/types';

	interface Props {
		tool: ToolEntry;
	}
	let { tool }: Props = $props();
</script>

<div class="whitespace-pre-wrap">
	{JSON.stringify(tool, null, 2)}
</div>
