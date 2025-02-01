export class TOTP {
    public period: number;
    public digits: number;

    constructor() {
        this.period = 30;
        this.digits = 6;
    }

    private format(str: string): string {
        return str
                .toLocaleLowerCase()
                .split(' ')
                .join('')
                .toString();
    }

    private decBase32(encStr: string): Uint8Array {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
        const padding = '=';
        const bits = 5;
        const output = [];
        let buffer = 0;
        let remaining = 0;

        for (const char of encStr.toUpperCase()) {
            if (char === padding) {
                break;
            }

            const val = chars.indexOf(char);

            if (val === -1) {
                throw new Error('Invalid Base32 character.');
            }

            buffer = (buffer << bits) | val;
            remaining += bits;

            if (remaining >= 8) {
                remaining -= 8;
                output.push((buffer >> remaining) & 0xff);
            }
        }

        return new Uint8Array(output);
    }

    private async genHOTP(key: string, counter: number): Promise<string> {
        const kBuffer = this.decBase32(key);

        const cBuffer = new ArrayBuffer(8);
        const cView = new DataView(cBuffer);

        for (let i = 7; i >= 0; i--) {
            cView.setUint8(i, counter & 0xff);
            counter >>= 8;
        }

        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            kBuffer,
            { 
                name: 'HMAC', 
                hash: 'SHA-1' 
            },
            false,
            ['sign'],
        );

        const hmac = new Uint8Array(
            await crypto.subtle.sign('HMAC', cryptoKey, cBuffer),
        );
        const offset = hmac[hmac.length - 1] & 0x0f;

        const binary =
            ((hmac[offset] & 0x7f) << 24) |
            ((hmac[offset + 1] & 0xff) << 16) |
            ((hmac[offset + 2] & 0xff) << 8) |
            (hmac[offset + 3] & 0xff);

        const otp = binary % 10 ** this.digits;
        return otp.toString().padStart(this.digits, '0');
    }

    async gen(key: string): Promise<string> {
        const time = Math.floor(Date.now() / 1000);
        const counter = Math.floor(time / this.period);

        return await this.genHOTP(this.format(key), counter);
    }
}
