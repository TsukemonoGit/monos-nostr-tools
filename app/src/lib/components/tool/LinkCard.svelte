<script lang="ts">
	import { ChevronRight } from '@lucide/svelte';
	import type { Component } from 'svelte';

	interface Props {
		Icon: Component;
		title: string;
		description: string;
		link: string;
	}
	let { Icon, title, description, link }: Props = $props();
</script>

<a
	href={link}
	class="rounded-md bg-gray-100 button-animation grid grid-cols-[auto_1fr_auto] gap-4 p-4"
>
	<div class="my-auto text-gray-600"><Icon /></div>
	<div class="flex flex-col">
		<h3 class="text-lg">{title}</h3>
		<p>{description}</p>
	</div>

	<ChevronRight class="text-gray-600 my-auto" />
</a>
