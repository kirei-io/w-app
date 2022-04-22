<script lang="ts">
	import './Global.css';
	import { _ } from 'svelte-i18n';
	import Icon from '@iconify/svelte';
	import { Weather } from './lib/Weather';
	import { city, inputValue, lang, theme } from './lib/stores';
	import AutosizeTextInput from './components/AutosizeTextInput.svelte';
	import Button from './components/Button.svelte';
	import Deg from './components/Deg.svelte';
	import FDate from './components/FDate.svelte';
	import Localization from './components/Localization.svelte';

	let weatherData: Promise<Weather>;
	const weatherExample = Weather.example();
	
	city.subscribe(async name => {
		try {
			weatherData = Weather.create(name);
			city.set(
				(await weatherData).location.city[$lang]+', '+
				(await weatherData).location.country)
			$inputValue = $city
		} catch (error) {
			throw error
		}
	});

	lang.subscribe(lang => {
		weatherData.then(weather => {
			$inputValue = weather.location.city[lang] + ', ' + weather.location.country;
		})
	})



	function searchButtonHandler() {
		city.set($inputValue)
	}

	function onChangeLanguageHandler() {
		if($lang === 'en') {
			lang.set('ru');
		} else {
			lang.set('en');
		}
	}
	function onChangeThemeHandler() {
		if($theme === 'dark') {
			theme.set('light');
		} else {
			theme.set('dark');
		}
	}

</script>
<div id="app" class="theme-{$theme}">
	<Localization>
		{#await weatherData}
			<!-- LOADING -->
			<header class="header">
				<div class="date">
					<FDate 
						dt={Date.now()}
						offset={0}
						size={'full'}
					/>
				</div>
				<div class="information">
					{$_('information.loading.0')}
					<!-- information 0 -->
					<AutosizeTextInput />
					<Button 
						on:click={searchButtonHandler} 
						disabled={true}
					>
						<Icon icon="flat-color-icons:search" inline={true}/>
					</Button>
					<!-- Search -->
					{$_('information.loading.1')} 
				</div>
			</header>
			<!-- Header -->
			<main class="content blur">
				<div class="current">
					<Icon 
						height='6rem' 
						icon="{'wi:owm-'+weatherExample.current.weatherId}"
					/>
					<div class="current__temperature">
						<Icon icon="eos-icons:bubble-loading" />
						<!-- {weather.current.temperature.current}<Deg/> -->
					</div>
					<div class="current__details">
						<div class="details-item">
							<Icon icon="wi:humidity" height="1.5rem" /> 
							{weatherExample.current.humidity}%
						</div>
						<div class="details-item">
							<Icon icon="wi:barometer" height="1.5rem" /> 
							{weatherExample.current.pressure}{$_('units.mmHg')}
						</div>
						<div class="details-item">
							<Icon icon="wi:strong-wind" height="1.5rem" /> 
							{weatherExample.current.wind.speed}{$_('units.mps')}
							{$_('direction.'+weatherExample.current.wind.direction)}
						</div>
					</div>
				</div>
				<!-- Current -->

				<div class="daily">
					{#each weatherExample.daily.filter((v, i)=>i!==0 && i<5) as forecast}
						<div class="forecast-card">
							<Icon 
								style="color: var(--accent-color)" 
								height='4rem' 
								icon="{'wi:owm-'+forecast.weatherId}"
							/>
							<div class="forecast-card__temperature">
								{forecast.temperature.max}<Deg/> / {forecast.temperature.min}<Deg/>
							</div>
							<div class="forecast-card__date">
								<FDate dt={forecast.dt} offset={weatherExample.timezoneOffset} size='short'/>
							</div>
						</div>
					{/each}
				</div>
				<!-- Daily -->
			</main>
			<!-- Content -->
			<footer class="footer">
				<Button on:click={onChangeLanguageHandler} disabled>
					{#if $lang==='en'}
						EN
					{:else}
						RU
					{/if}
				</Button>
				<Button on:click={onChangeThemeHandler} disabled>
					{#if $theme==='light'}
						<Icon icon="twemoji:sun" inline={true} alt="Dark"/>
					{:else}
						<Icon icon="twemoji:crescent-moon" inline={true} alt="Light"/>
					{/if}
				</Button>
			</footer>
			<!-- Fototer -->
		{:then weather}
			<!-- CONTENT -->
			<header class="header">
				<div class="header__date">
					<FDate 
						dt={weather.current.dt} 
						offset={weather.timezoneOffset} 
						size='full'
					/>
				</div>
				<!-- Date -->
				<div class="information">
					{$_('information.then.0')}
					<!-- information 0 -->
					<AutosizeTextInput />
					<Button 
						on:click={searchButtonHandler} 
						disabled={!$inputValue||$inputValue===$city}
					>
						<Icon icon="flat-color-icons:search" inline={true}/>
					</Button>
					<!-- Search -->
					{$_('information.then.1')} 
					{$_('weatherCondition.'+weather.current.weatherId)}.
				</div>
				<!-- information -->
			</header>
			<!-- Header -->
			<main class="content">
				<div class="current">
					<Icon 
						height='6rem' 
						icon="{'wi:owm-'+weather.current.weatherId}"
					/>
					<div class="current__temperature">
						{weather.current.temperature.current}<Deg/>
					</div>
					<div class="current__details">
						<div class="details-item">
							<Icon icon="wi:humidity" height="1.5rem" /> 
							{weather.current.humidity}%
						</div>
						<div class="details-item">
							<Icon icon="wi:barometer" height="1.5rem" /> 
							{weather.current.pressure}{$_('units.mmHg')}
						</div>
						<div class="details-item">
							<Icon icon="wi:strong-wind" height="1.5rem" /> 
							{weather.current.wind.speed}{$_('units.mps')}
							{$_('direction.'+weather.current.wind.direction)}
						</div>
					</div>
				</div>
				<!-- Current -->

				<div class="daily">
					{#each weather.daily.filter((v, i)=>i!==0 && i<5) as forecast}
						<div class="forecast-card">
							<Icon 
								style="color: var(--accent-color)" 
								height='4rem' 
								icon="{'wi:owm-'+forecast.weatherId}"
							/>
							<div class="forecast-card__temperature">
								{forecast.temperature.max}<Deg/> / {forecast.temperature.min}<Deg/>
							</div>
							<div class="forecast-card__date">
								<FDate dt={forecast.dt} offset={weather.timezoneOffset} size='short'/>
							</div>
						</div>
					{/each}
				</div>
				<!-- Daily -->
			</main>
			<!-- Content -->
			<footer class="footer">
				<Button on:click={onChangeLanguageHandler}>
					{#if $lang==='en'}
						EN
					{:else}
						RU
					{/if}
				</Button>
				<Button on:click={onChangeThemeHandler}>
					{#if $theme==='light'}
						<Icon icon="twemoji:sun" inline={true} alt="Dark"/>
					{:else}
						<Icon icon="twemoji:crescent-moon" inline={true} alt="Light"/>
					{/if}
				</Button>
			</footer>
			<!-- Fototer -->

		{:catch error}
			<!-- ERROR -->
			<header class="header header_index">
				<div class="header__date">
					<FDate 
						dt={weatherExample.current.dt} 
						offset={weatherExample.timezoneOffset} 
						size='full'
					/>
				</div>
				<!-- Date -->
				<div class="information">
					{$_('information.notFind.0')}
					<!-- information 0 -->
					<AutosizeTextInput />
					<Button 
						on:click={searchButtonHandler} 
						disabled={!$inputValue||$inputValue===$city}
					>
						<Icon icon="flat-color-icons:search" inline={true}/>
					</Button>
					<!-- Search -->
					{$_('information.notFind.1')}
				</div>
				<!-- information -->
			</header>

			<main class="content blur">
				<div class="current">
					<Icon 
						height='6rem' 
						icon="{'wi:owm-'+weatherExample.current.weatherId}"
					/>
					<div class="current__temperature">
						<Icon icon="eos-icons:bubble-loading" />
						<!-- {weather.current.temperature.current}<Deg/> -->
					</div>
					<div class="current__details">
						<div class="details-item">
							<Icon icon="wi:humidity" height="1.5rem" /> 
							{weatherExample.current.humidity}%
						</div>
						<div class="details-item">
							<Icon icon="wi:barometer" height="1.5rem" /> 
							{weatherExample.current.pressure}{$_('units.mmHg')}
						</div>
						<div class="details-item">
							<Icon icon="wi:strong-wind" height="1.5rem" /> 
							{weatherExample.current.wind.speed}{$_('units.mps')}
							{$_('direction.'+weatherExample.current.wind.direction)}
						</div>
					</div>
				</div>
				<!-- Current -->

				<div class="daily">
					{#each weatherExample.daily.filter((v, i)=>i!==0 && i<5) as forecast}
						<div class="forecast-card">
							<Icon 
								style="color: var(--accent-color)" 
								height='4rem' 
								icon="{'wi:owm-'+forecast.weatherId}"
							/>
							<div class="forecast-card__temperature">
								{forecast.temperature.max}<Deg/> / {forecast.temperature.min}<Deg/>
							</div>
							<div class="forecast-card__date">
								<FDate dt={forecast.dt} offset={weatherExample.timezoneOffset} size='short'/>
							</div>
						</div>
					{/each}
				</div>
				<!-- Daily -->
			</main>
			<!-- Content -->
			<footer class="footer">
				<Button on:click={onChangeLanguageHandler} disabled>
					{#if $lang==='en'}
						EN
					{:else}
						RU
					{/if}
				</Button>
				<Button on:click={onChangeThemeHandler} disabled>
					{#if $theme==='light'}
						<Icon icon="twemoji:sun" inline={true} alt="Dark"/>
					{:else}
						<Icon icon="twemoji:crescent-moon" inline={true} alt="Light"/>
					{/if}
				</Button>
			</footer>
			<!-- Fototer -->
			<div class="darken"></div>
		{/await}
	</Localization>
</div>

<style>
	#app {
		transition: color 0.1s, background-color 0.1s;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 3rem;
		width: 100vw;
		height: 100vh;
		background-color: var(--background-color);
		color: var(--text-color);

	}
	.header {
		padding: 1rem;
		text-align: center;
	}

	.header_index {
		z-index: 3;
		background-color: var(--background-color);
	}
	.darken {
		z-index: 2;
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.123);
	}
	.blur {
		filter: blur(5px);
	}
	.information {
		margin-top: 0.5rem;
	}
	
	.current, .daily {
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 1rem
	}
	.current {
		margin-bottom: 1rem;
	}
	.current__icon {
		font-size: 5rem;
	}
	.current__temperature {
		font-size: 5rem;
		color: var(--text-accent-color);
	}
	.current__details {
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
	}
	.forecast-card {
		text-align: center;
	}
	.forecast-card__temperature {
		font-size: 1.5rem;
	}
	.forecast-card__date {
		font-size: 0.8rem;
		text-transform: uppercase;
	}
	.details-item {
		display: flex;
		flex-direction: row;
		align-items: center;
	}
</style>