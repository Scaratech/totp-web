export class CookieWrapper {
    set(key: string, value: string): void {
        const obj = { value };

        const encoded = this.encode(obj);
        let str = `${key}=${encoded}; path=/`;
  
        document.cookie = str;
    }

    get(key: string): string | null {
        const cookie = this.getCookie(key);

        if (cookie) {
            const decCookie = this.decode(cookie);
            return decCookie.value;
        }

        return null;
    }

    getAll(): Record<string, string> {
        const cookies = document.cookie.split('; ');
        const decCookies: Record<string, string> = {};
  
        cookies.forEach(cookie => {
            const [key, encoded] = cookie.split('=');
            const decCookie = this.decode(decodeURIComponent(encoded));

            decCookies[key] = decCookie.value;
        });
  
        return decCookies;
    }
  
    delete(key: string): void {
        document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    }
  
    private encode(obj: { value: string }): string {
        return btoa(JSON.stringify(obj));
    }
  
    private decode(encodedCookie: string): { value: string } {
        const decoded = atob(encodedCookie);
        return JSON.parse(decoded);
    }
  
    private getCookie(key: string): string | null {
        const cookies = document.cookie.split('; ');

        for (const cookie of cookies) {
            const [k, v] = cookie.split('=');

            if (k === key) {
                return decodeURIComponent(v);
            }
        }

        return null;
    }
}