export class LocalStorage {
  static get(key: string) {
    const value = localStorage.getItem(key);
    if (!value) {
      return null;
    }
    try {
      return JSON.parse(value);
    } catch (error) {
      return null;
    }
  }
  static set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  static delete(key: string) {
    localStorage.removeItem(key);
  }
  static clear() {
    localStorage.clear();
  }
}
