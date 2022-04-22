import { 
  init,
  register 
} from 'svelte-i18n';


register('en', () => import('../lang/en.json'));
register('ru', () => import('../lang/ru.json'));
init({
  initialLocale: 'en',
  fallbackLocale: 'en',
});