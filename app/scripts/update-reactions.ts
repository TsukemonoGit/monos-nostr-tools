import fs from 'fs';

const filePath = './src/lib/data/reactions.json';
async function main() {
	try {
		const raw = fs.readFileSync(filePath, 'utf-8');

		//TODO: update

		fs.writeFileSync(filePath, raw);
	} catch (error) {
		fs.writeFileSync(filePath, JSON.stringify({}, null, 2));
	}

	console.log('done');
}

main();
