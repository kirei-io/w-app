<script lang="ts">
  import { _ } from "svelte-i18n";

  import { WeatherDate } from "../lib/WeatherDate";


  export let dt: number;
  export let offset: number;
  export let size: 'full'|'short';

  const date = new WeatherDate(dt, offset);
</script>
{$_('dayOfWeek.'+size+'.'+date.dayOfWeek)}, {$_('month.'+size+'.'+date.month)} {date.day}