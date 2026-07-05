<script lang="ts">
	import { Label } from '$lib/components/ui/label';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';

	interface LangFields {
		question?: string;
		answer?: string;
		[key: string]: string | undefined;
	}

	interface Props {
		i18n: Record<string, LangFields>;
		bindI18n: Record<string, LangFields>;
		rows?: number;
	}

	let { i18n, bindI18n, rows = 3 }: Props = $props();
</script>

{#each Object.keys(i18n) as lang}
	<div>
		<Label class="font-bold mb-2 block">
			{lang.charAt(0).toUpperCase() + lang.slice(1)}
		</Label>

		{#if i18n[lang].question !== undefined}
			<Label class="text-xs mb-1 block">Question</Label>
			<Textarea bind:value={bindI18n[lang].question} {rows} class="mb-2" />
		{/if}

		{#if i18n[lang].answer !== undefined}
			<Label class="text-xs mb-1 block">Answer</Label>
			<Textarea bind:value={bindI18n[lang].answer} {rows} />
		{/if}
	</div>
{/each}
