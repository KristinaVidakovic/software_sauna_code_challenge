import { Command } from 'commander';
import * as fs from 'fs';
import code_challenge from './app';

const program = new Command();

program.option('-f, --file <path>', 'file path').parse(process.argv);

const options = program.opts();

if (!options.file) {
    console.error('Error: You must specify a file using the -f or --file option.');
    process.exit(1);
}

try {
    const content = fs.readFileSync(options.file, { encoding: 'utf8' });
    const contentMatrix = content.split('\n').map((str) => str.split(''));
    const finalPath = code_challenge(contentMatrix);
    console.log(`Letters: ${finalPath.letters} \nPath: ${finalPath.path}`);
} catch (error) {
    console.error(error);
    process.exit(1);
}
