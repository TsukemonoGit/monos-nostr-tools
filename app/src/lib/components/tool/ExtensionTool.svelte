<script lang="ts">
	import type { ExtensionEntry } from '$lib/types';

	interface Props {
		tool: ExtensionEntry;
	}
	let { tool }: Props = $props();
</script>

<div class="whitespace-pre-wrap">
	{JSON.stringify(tool, null, 2)}
</div>
