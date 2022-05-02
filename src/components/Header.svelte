<script lang="ts">
  import Icon from "@iconify/svelte";
  import { _ } from "svelte-i18n";
  import { Status } from "../lib/Status";
  import { city, inputValue } from "../lib/stores";
  import type { WeatherAppInterace } from "../lib/types/WeatherAppInterface";
  import AutosizeTextInput from "./AutosizeTextInput.svelte";
  import Button from "./Button.svelte";
  import WDate from "./WDate.svelte";


  export let status: Status = Status.DONE;
  export let weather: WeatherAppInterace;

  const disabled: boolean = status === Status.LOADING;

	function searchButtonHandler() {
		city.set($inputValue)
	}

</script>

<header>
  <WDate 
    size='full'
    dt={weather.current.dt}
    offset={weather.timezoneOffset}
  />
  <!-- date -->
  <div class="information flex_row">
    <div class="information__0">
      {$_(`information.${status}.0`)}
    </div>
    <!-- information 0 -->
    <div class="search">
      <AutosizeTextInput />
      <Button on:click={searchButtonHandler} disabled={disabled}>
        <Icon icon="flat-color-icons:search" inline={true} />
      </Button>
    </div>
    <!-- Search -->
    <div class="information__1">
      {$_(`information.${status}.1`)}
      <!-- information 1 -->
      {#if status === Status.DONE}
        {$_('weatherCondition.'+weather.current.weatherId)}
      {/if}
    </div>
  </div>
  <!-- information -->
</header>

<style>
  header {
    text-align: center;
  }
  .information {
    margin-top: 1rem;
    align-items: center;
    gap: 0.5rem;
  }

  @media only screen and (max-width: 760px) {
		.information {
      margin-top: 1rem;
      flex-direction: column;
		}
	}
</style>