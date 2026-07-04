<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { Check, Copy } from '@lucide/svelte';
	import DetailCard from '../DetailCard.svelte';

	let { install } = $props();

	let copied = $state(false);

	async function copyToClipboard(text: string) {
		try {
			await navigator.clipboard.writeText(text);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch {
			console.error('クリップボードのコピーに失敗しました');
		}
	}
</script>

<DetailCard title={m.detail_install()}>
	<div class="relative">
		<button
			class="absolute top-2 right-2 p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors z-10"
			onclick={() => copyToClipboard(install)}
			title="コピー"
		>
			{#if copied}
				<Check size={16} />
			{:else}
				<Copy size={16} />
			{/if}
		</button>
		<pre class="bg-gray-800 text-gray-100 rounded-md p-4 pr-12 overflow-x-auto text-sm"><code
				>{install}</code
			></pre>
	</div>
</DetailCard>
