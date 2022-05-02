import { writable } from "svelte/store";
import { LocalStorage } from "./LocalStorage";


export const enum Theme {
  DARK = 'dark',
  LIGHT = 'light'
}
export const enum Lang {
  EN = 'en',
  RU = 'ru',
}

export const enum LocalStorageKey {
  city = 'city',
  lang = 'lang',
  theme = 'theme',
}

function createStoreElement<T extends string>(key: LocalStorageKey) {
  const storage = LocalStorage.getInstance();
  const { subscribe, update, set } = writable<T>(storage.getItem(key));

  return {
    subscribe,
    update,
    set: (value: T) => {
      storage.setItem(key, value);
      set(value);
    }
  }
}


export const city = createStoreElement<string>(LocalStorageKey.city);
export const lang = createStoreElement<Lang>(LocalStorageKey.lang);
export const theme = createStoreElement<Theme>(LocalStorageKey.theme);
export const inputValue = writable<string>(LocalStorage.getInstance().getItem(LocalStorageKey.city));
