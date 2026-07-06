export function useArrayEditor<T>(items: T[], onChange: (next: T[]) => void) {
	function add(entry: T) {
		onChange([...items, entry]);
	}

	function remove(idx: number) {
		onChange(items.filter((_: T, i: number) => i !== idx));
	}

	function move(from: number, to: number) {
		if (to < 0 || to >= items.length) return;
		const arr = [...items];
		const [item] = arr.splice(from, 1);
		arr.splice(to, 0, item);
		onChange(arr);
	}

	return { add, remove, move };
}
