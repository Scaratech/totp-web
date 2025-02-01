// This entire file is embarrassing man don't read it
import { CookieWrapper } from './CookieWrapper.js';

export class KeyManager {
    export() {
        const wrapper = new CookieWrapper();
        const cookies = wrapper.getAll();

        const blob = new Blob([JSON.stringify(cookies, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');

        link.href = url;
        link.download = 'backup.json';
        link.click();

        URL.revokeObjectURL(url);
    }

    import() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';

        input.addEventListener('change', (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = (ev) => {
                    try {
                        const content = ev.target?.result as string;
                        const cookies = JSON.parse(content);

                        const wrapper = new CookieWrapper();

                        for (const [key, value] of Object.entries(cookies)) {
                            wrapper.set(key, value as string);
                        }
                    } catch (err) {
                        console.error('Failed to import cookies:', err);
                    }
                };

                reader.onerror = (err) => {
                    console.error('Error reading file', err);
                };

                reader.readAsText(file);
            }
        });

        input.click();
    }
}
