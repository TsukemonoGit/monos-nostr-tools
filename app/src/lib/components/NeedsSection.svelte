<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { NeedData } from '$lib/types';
	import NeedCard from './NeedCard.svelte';

	const needs: NeedData[] = [
		{
			title: '認証',
			description: 'ログインしたい'
		},
		{
			title: '投稿',
			description: '投稿したい'
		}
	];
</script>

<section class="my-12">
	<h2 class="text-xl font-title3 font-bold myContainer">
		{m.needs_title()}
	</h2>
	<div class="myContainer flex gap-2">
		{#each needs as need}
			<NeedCard data={need} />
		{/each}
	</div>
</section>
