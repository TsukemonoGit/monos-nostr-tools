import type { LucideIcon } from '@lucide/svelte';
import * as icons from '@lucide/svelte';
import markdownit from 'markdown-it';

export function getIcon(icon: string): LucideIcon | null {
	if (!icon) return null;
	try {
		return (icons as any)[icon];
	} catch {
		return null;
	}
}

export const md = markdownit({
	html: false,
	linkify: false,
	typographer: false,
	breaks: true
});
