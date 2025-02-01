import { TOTP } from '../dist/TOTP.js';

const key = 'NNSXS==='; // Demo
let code;

async function generateCode() {
    const totp = new TOTP();

    code = await totp.gen(key);
}

async function main() {
    await generateCode();
    console.log(`Generated code: ${code}`);
}

main();
