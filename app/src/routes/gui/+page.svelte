<script lang="ts">
	import { onMount } from 'svelte';
	import JsonEditor from '$lib/components/json-editor/JsonEditor.svelte';
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Tabs, TabsContent, TabsList, TabsTrigger } from '$lib/components/ui/tabs';
	import { AlertCircle, Loader2 } from '@lucide/svelte';

	const FILES = ['tools.json', 'faq.json', 'features.json', 'needs.json'] as const;
	type File = (typeof FILES)[number];

	let activeFile = $state<File>('tools.json');
	let fileData = $state<Record<File, unknown>>({
		'tools.json': null,
		'faq.json': null,
		'features.json': null,
		'needs.json': null
	});
	let loading = $state<Record<File, boolean>>({
		'tools.json': true,
		'faq.json': true,
		'features.json': true,
		'needs.json': true
	});
	let errors = $state<Record<File, string | null>>({
		'tools.json': null,
		'faq.json': null,
		'features.json': null,
		'needs.json': null
	});

	async function reloadFile(file: File) {
		loading[file] = true;
		errors[file] = null;
		try {
			const res = await fetch(`/gui/api?file=${file}`);
			if (!res.ok) throw new Error(`Failed to reload ${file}`);
			const result = await res.json();
			fileData[file] = result.content;
		} catch (err) {
			errors[file] = err instanceof Error ? err.message : String(err);
		} finally {
			loading[file] = false;
		}
	}

	// Load all files on mount
	onMount(() => {
		for (const file of FILES) {
			reloadFile(file as File);
		}
	});
</script>

<div class="container mx-auto max-w-6xl py-8 space-y-6">
	<div class="space-y-1">
		<h1 class="text-3xl font-bold tracking-tight">JSON Data Editor</h1>
		<p class="text-muted-foreground">
			View and edit project data files. Changes are saved directly to <code
				class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">src/lib/data/</code
			>.
		</p>
	</div>

	<Tabs bind:value={activeFile} class="w-full">
		<TabsList class="grid w-full grid-cols-4">
			{#each FILES as file}
				<TabsTrigger value={file} class="flex items-center gap-2">
					{#if loading[file]}
						<Loader2 class="h-4 w-4 animate-spin" />
					{:else if errors[file]}
						<AlertCircle class="h-4 w-4 text-red-500" />
					{/if}
					<span class="font-mono text-xs">{file}</span>
				</TabsTrigger>
			{/each}
		</TabsList>

		{#each FILES as file}
			<TabsContent value={file} class="mt-6">
				{#if loading[file]}
					<Card>
						<CardContent class="flex items-center justify-center py-16">
							<Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
							<span class="ml-3 text-muted-foreground">Loading...</span>
						</CardContent>
					</Card>
				{:else if errors[file]}
					<Card>
						<CardContent class="flex items-center gap-3 py-8 text-red-500">
							<AlertCircle class="h-5 w-5 shrink-0" />
							<div>
								<p class="font-medium">Failed to load {file}</p>
								<p class="text-sm text-muted-foreground">{errors[file]}</p>
							</div>
						</CardContent>
					</Card>
				{:else}
					<JsonEditor {file} data={fileData[file]} onsave={() => reloadFile(file)} />
				{/if}
			</TabsContent>
		{/each}
	</Tabs>
</div>

<style lang="postcss">
	@reference "tailwindcss";
</style>
