import { json } from '@sveltejs/kit';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, '../../../lib/data');

const ALLOWED_FILES = ['tools.json', 'faq.json', 'features.json', 'needs.json'];

export async function GET({ url }) {
	const file = url.searchParams.get('file');

	if (!file || !ALLOWED_FILES.includes(file)) {
		return json({ error: 'Invalid or disallowed file' }, { status: 400 });
	}

	const filePath = join(DATA_DIR, file);
	if (!existsSync(filePath)) {
		return json({ error: 'File not found' }, { status: 404 });
	}

	const content = readFileSync(filePath, 'utf-8');
	return json({ file, content: JSON.parse(content) });
}

export async function POST({ request }) {
	const body = await request.json();
	const { file, data } = body as { file: string; data: unknown };

	if (!file || !ALLOWED_FILES.includes(file)) {
		return json({ error: 'Invalid or disallowed file' }, { status: 400 });
	}

	const filePath = join(DATA_DIR, file);
	writeFileSync(filePath, JSON.stringify(data, null, '\t'), 'utf-8');

	return json({ ok: true, file });
}
