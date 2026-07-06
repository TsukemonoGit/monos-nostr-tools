<script module lang="ts">
	import type { Tool as _Tool } from '../tool-editor/useToolDetail.svelte.ts';

	export interface ToolsMap {
		[key: string]: _Tool;
	}
</script>

<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import {
		Table,
		TableBody,
		TableCell,
		TableHead,
		TableHeader,
		TableRow
	} from '$lib/components/ui/table';
	import { Pencil, Trash2, Plus } from '@lucide/svelte';
	import type { Tool } from '../tool-editor/useToolDetail.svelte.ts';

	let {
		tools,
		onChange,
		onEdit
	}: { tools: ToolsMap; onChange: (tools: ToolsMap) => void; onEdit: (key: string) => void } =
		$props();

	let newToolKey = $state('');

	function add() {
		if (!newToolKey.trim() || !tools || tools[newToolKey.trim()]) return;
		const tool: Tool = {
			category: 'webapp',
			audience: 'enduser',
			websiteUrl: '',
			icon: '',
			screenshots: [],
			relatedLinks: [],
			faqs: [{ id: '', i18n: { ja: {}, en: {} } }],
			i18n: {
				ja: {
					name: newToolKey.trim(),
					description: '',
					tagline: '',
					highlights: '',
					whatsNew: []
				}
			}
		};
		onChange({ ...tools, [newToolKey.trim()]: tool });
		newToolKey = '';
	}

	function remove(key: string) {
		const copy = { ...tools };
		delete copy[key];
		onChange(copy);
	}

	function handleToolChange(key: string, tool: Tool) {
		onChange({ ...tools, [key]: tool });
	}
</script>

<div class="space-y-4">
	<Table>
		<TableHeader>
			<TableRow>
				<TableHead class="w-40">Tool ID</TableHead>
				<TableHead>Category</TableHead>
				<TableHead>Audience</TableHead>
				<TableHead>Name (JA)</TableHead>
				<TableHead class="w-24">Actions</TableHead>
			</TableRow>
		</TableHeader>
		<TableBody>
			{#each tools ? Object.entries(tools) : [] as [key, tool]}
				<TableRow class="bg-muted/50">
					<TableCell class="font-mono font-bold">{key}</TableCell>
					<TableCell>
						<span class="px-2 py-0.5 rounded text-xs bg-muted">{tool.category}</span>
					</TableCell>
					<TableCell>
						<span class="px-2 py-0.5 rounded text-xs bg-muted">{tool.audience}</span>
					</TableCell>
					<TableCell>{tool.i18n?.ja?.name || '-'}</TableCell>
					<TableCell>
						<div class="flex gap-1">
							<Button variant="ghost" size="icon" onclick={() => onEdit(key)}>
								<Pencil class="h-4 w-4" />
							</Button>
							<Button variant="ghost" size="icon" onclick={() => remove(key)}>
								<Trash2 class="h-4 w-4 text-red-500" />
							</Button>
						</div>
					</TableCell>
				</TableRow>
			{/each}
		</TableBody>
	</Table>

	<Separator class="my-4" />
	<div class="flex gap-2 items-center">
		<Input
			bind:value={newToolKey}
			placeholder="New tool ID"
			class="font-mono"
			onkeydown={(e) => e.key === 'Enter' && add()}
		/>
		<Button size="sm" onclick={add}>Add Tool</Button>
	</div>
</div>
