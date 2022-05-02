<script lang="ts">
  import Icon from "@iconify/svelte";
  import { _ } from "svelte-i18n";
import App from "../App.svelte";
  import { Status } from "../lib/Status";
  import type { WeatherAppInterace } from "../lib/types/WeatherAppInterface";
  import Deg from "./Deg.svelte";
  import WDate from "./WDate.svelte";


  export let status: Status = Status.DONE;
  export let weather: WeatherAppInterace


  const blur = status !== Status.DONE ? 'blur' : ''
</script>

<main class='content flex_col {blur}'>
  <div class="current flex_row">
    <div class="current__weather flex_row">
      <Icon
        placeholder="test"
        height='6rem' 
        icon="{'wi:owm-'+weather.current.weatherId}"
      />
      <!-- weather icon -->  
      <div class="temperature">
        {#if status !== Status.DONE}
          <Icon icon="eos-icons:bubble-loading" />
        {:else}
          {weather.current.temperature.current}<Deg/>
        {/if}
      </div>
      <!-- temperature -->
    </div>
    <!-- current weather -->

    <div class="current__details flex_col">
      <div class="details-item flex_row">
        <Icon icon="wi:humidity" height="1.5rem"/> 
        {weather.current.humidity}%
      </div>
      <div class="details-item flex_row">
        <Icon icon="wi:barometer" height="1.5rem" /> 
        {weather.current.pressure}{$_('units.mmHg')}
      </div>
      <div class="details-item flex_row">
        <Icon icon="wi:strong-wind" height="1.5rem" /> 
        {weather.current.wind.speed}{$_('units.mps')}
        {$_('direction.'+weather.current.wind.direction)}
      </div>
    </div>
    <!-- current details -->
  </div>
  <!-- current -->

  <div class="daily flex_row">
    {#each weather.daily.filter((v, i)=>i!==0 && i<5) as forecast}
      <div class="forecast-card">
        <Icon 
          style="color: var(--accent-color)" 
          height='4rem' 
          icon="{'wi:owm-'+forecast.weatherId}"
        />
        <!-- icon -->
        <div class="forecast-card__temperature">
          {forecast.temperature.max}<Deg/> / 
          {forecast.temperature.min}<Deg/>
        </div>
        <!-- temperature -->
        <WDate 
          size='short'
          dt={forecast.dt}
          offset={weather.timezoneOffset}
        />
        <!-- date -->
      </div>
      <!-- forecast card -->
    {/each}
  </div>
  <!-- daily -->
</main>


<style>

.content {
  align-items: center;
  gap: 1rem;
}
.current {
  gap: 1.5rem;
}
.current__weather {
  align-items: center;
  gap: 1rem;
}
.temperature {
  font-size: 5rem;
  color: var(--text-accent-color);
}
.current__details {
  justify-content: center;
  gap: 0.3rem;
}
.details-item {
  align-items: center;
}
.daily {
  gap: 2rem;
}
.forecast-card {
  text-align: center;
  text-transform: uppercase;
}
.forecast-card__temperature {
  font-size: 140%;
  margin-bottom: 0.3rem;
}
.blur {
	filter: blur(5px);
}

@media only screen and (max-width: 760px) {
  .current {
    flex-direction: column;
    align-items: center;
  }
  .current__details {
    flex-direction: row;
    gap: 1rem;
  }
  .daily {
    flex-direction: column;
    flex-wrap: wrap;
    max-height: 20rem;
    align-content: center;
  }
}
</style>