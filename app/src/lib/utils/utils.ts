import type { LucideIcon } from '@lucide/svelte';
import * as icons from '@lucide/svelte';

export function getIcon(icon: string): LucideIcon | null {
	if (!icon) return null;
	try {
		return (icons as any)[icon];
	} catch {
		return null;
	}
}
