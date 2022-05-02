import { LocalStorageKey, Lang, Theme } from "./stores";

export class LocalStorage {
  private static instance: LocalStorage;
  private readonly storage: Storage;

  private constructor() {
    this.storage = localStorage;
    this.initValue(LocalStorageKey.city, 'london');
    this.initValue<Lang>(LocalStorageKey.lang, Lang.EN);
    this.initValue<Theme>(LocalStorageKey.theme, Theme.LIGHT);
  }

  public static getInstance(): LocalStorage {
    if(!LocalStorage.instance) {
      LocalStorage.instance = new LocalStorage();
    }
    return LocalStorage.instance;
  }

  private initValue<T extends string>(key: string, value: T) {
    if(!this.getItem(key)) {
      this.setItem(key, value);
    }

  }

  public getItem<T extends string>(key: string): T {
    return this.storage.getItem(key) as T
  }

  public setItem<T extends string>(key: string, value: T) {
    this.storage.setItem(key, value)
  }

}