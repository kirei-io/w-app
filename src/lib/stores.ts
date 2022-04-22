import { writable } from "svelte/store";

type ThemeType = 'dark'|'light';
type LangType = 'en'|'ru';

function localStorageCheck(name: string, deafault: string) {
  if(!localStorage.getItem(name)) {
    localStorage.setItem(name, deafault);
    // debug
    console.log('Set new: '+localStorage.getItem(name));
  }
}

function createCity() {
  const name = 'city'
  localStorageCheck(name, 'london');

  const { subscribe, update, set } = writable<string>(localStorage.getItem(name));

  return {
    subscribe,
    set: (value: string) => {
      localStorage.setItem(name, value);
      set(value);
      console.log(name+' updated to '+value);
      
    }
  }
}

function createLang() {
  const name = 'lang';
  localStorageCheck(name, 'en');

  const { subscribe, update, set } = writable<LangType>(localStorage.getItem(name) as LangType);

  return {
    subscribe,
    set: (value: LangType) => {
      localStorage.setItem(name, value);
      set(value);
      console.log(name+' updated to '+value);
    }
  }
}

function createTheme() {
  const name = 'theme';
  localStorageCheck(name, 'light');

  const { subscribe, update, set } = writable<ThemeType>(localStorage.getItem(name) as ThemeType);
  
  return {
    subscribe,
    set: (value: ThemeType) => {
      localStorage.setItem(name, value);
      set(value);
      console.log(name+' updated to '+value);
    }
  }
}




export const city = createCity();
export const lang = createLang();
export const inputValue = writable<string>(localStorage.getItem('city'));
export const theme = createTheme();