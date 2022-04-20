import { 
  getLocaleFromNavigator, 
  init, 
  locale, 
  register 
} from 'svelte-i18n';

register('en', () => import('../lang/en.json'));
register('ru', () => import('../lang/ru.json'));
init({
  initialLocale: getLocaleFromNavigator(),
  fallbackLocale: 'en',
});
locale.set('en');