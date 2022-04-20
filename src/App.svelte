<script lang="ts">
	import './Global.css';
	import './lib/i18n';
	import Deg from './components/Deg.svelte';
	import { Units } from './lib/Units';
	import { 
		getLocaleFromNavigator, 
		init, 
		isLoading,
		locale, 
		register, 
		_
	} from 'svelte-i18n';
	import Icon from '@iconify/svelte';
	import FDate from './components/FDate.svelte';
	import { writable } from 'svelte/store';

	register('en', () => import('./lang/en.json'));
	register('ru', () => import('./lang/ru.json'));
	init({
		fallbackLocale: 'en',
		initialLocale: getLocaleFromNavigator(),
	});

	type LocationType = {
		city: {
			ru: string,
			en: string,
		}
		country: string,
	}

	type CoordsType = {
		lat: string,
		lon: string,
	}

	interface WeatherAppInterace {
		timezoneOffset: number;
		location: 			LocationType;
		current: 				WeatherDetailsInterface;
		daily: 					WeatherDetailsInterface[];
	}

	interface WeatherDetailsInterface {
		dt: number;
		temperature: { min?: number, max?: number, current?: number};
		weatherId: number;
		pressure?: number;
		humidity?: number;
		wind?: {
			speed: number;
			direction: string;
		}
	}

	class OwmApiError extends Error {
		constructor(
			public readonly cod: number, 
			message: string
		) {
			super(message)
		}
	}

	class OwmApi {
		private readonly baseUrl = 'http://api.openweathermap.org/';
		private readonly endpoint = {
			geo: 'geo/1.0/direct',
			oneCall: 'data/2.5/onecall',
		}
		private readonly appid: ['appid', string];

		public constructor(appid: string) {
			this.appid = ['appid', appid];
		}

		private async request<T>(
			endpoint: string, 
			opts: Record<string, string>
		): Promise<T> {
			const params = this.optsToParams(opts);
			return fetch(this.baseUrl+endpoint+'?'+params.toString())
				.then(async response=>{
					if(!response.ok) {
						const errData = await response.json() as {message: string, cod: number};
						if(errData) throw new OwmApiError(errData.cod, errData.message);
						throw new Error(response.statusText);
					}
					return response.json()
				})
		}
		private optsToParams(opts: Record<string, string>): URLSearchParams {
			const params = new URLSearchParams([this.appid]);
			for (const name in opts) {
				if (Object.prototype.hasOwnProperty.call(opts, name)) {
					const value = opts[name];
					if(value) params.set(name, value);
				}
			}
			return params;
		}
		public geo = async (
			opts: GeoOptsType
		) => this.request<GeoResponseInterface[]>(this.endpoint.geo, opts);

		public oneCall = async (
			opts: OneCallOptsType
		) => this.request<OneCallResponseInterface>(this.endpoint.oneCall, opts);
		
		public static geoToLocation(
			geo: GeoResponseInterface[]
		): LocationType {
			return {
					city: { 
						ru: geo[0].local_names?.ru ?? geo[0].name, 
						en: geo[0].local_names?.en ?? geo[0].name
					},
					country: geo[0].country,
			}
		}

		public static geoToCoords(
			geo: GeoResponseInterface[]
		): CoordsType {
			return {
					lat: geo[0].lat.toString(),
					lon: geo[0].lon.toString(),
			}
		}

	}

	type GeoOptsType = {
		q: string;
		limit?: string;
	}
	type OneCallOptsType = {
		lat: string;
		lon: string;
		exclude?: string;
		units?: 'standard'|'metric'|'imperial';
		lang?: string;
	}

	interface GeoResponseInterface {
		lat: number;
		lon: number;
		country: string;
		name: string;
		local_names?: {
			ru?: string;
			en?: string;
		}
	}

	interface OneCallResponseInterface {
		lat: number;
		lon: number;
		timezone: string;
		timezone_offset: number;
		current: {
			clouds: number;
			dew_point: number;
			dt: number;
			feels_like: number;
			humidity: number;
			pressure: number;
			sunrise: number;
			sunset: number;
			temp: number;
			uvi: number;
			visibility: number;
			weather:[
				{
					description: string;
					icon: string;
					id: number
					main: string;
				}
			]
			wind_deg: number;
			wind_gust: number;
			wind_speed: number;
		};
		daily: {
			clouds: number;
			dew_point: number;
			dt: number;
			feels_like: {
				day: number, 
				night: number, 
				eve: number, 
				morn: number
			}
			humidity: number;
			moon_phase: number;
			moonrise: number;
			moonset: number;
			pop: number;
			pressure: number;
			sunrise: number;
			sunset: number;
			temp: {
				day: number, 
				night: number, 
				eve: number, 
				morn: number, 
				min: number, 
				max: number
			}
			uvi: number;
			weather: [
				{
					description: string;
					icon: string;
					id: number
					main: string;
				}
			]
			wind_deg: number;
			wind_gust: number;
			wind_speed: number;
		}[];
	}

	class Weather implements WeatherAppInterace {
		private constructor(
			public readonly location: LocationType,
			private readonly weatherResponse: OneCallResponseInterface,
		) {}

		public static async create(city: string): Promise<Weather> {
			return getWeather(city)
				.then(response=>new Weather(response.location, response.weatherResponse))
		} 

		public get timezoneOffset() {
			return this.weatherResponse.timezone_offset;
		}

		public get current(): WeatherDetailsInterface {
			return {
				dt: this.weatherResponse.current.dt*1000,
				temperature: {
					current: Math.round(this.weatherResponse.current.temp),
				},
				wind: {
					direction: Units.deg_to_direction(this.weatherResponse.current.wind_deg),
					speed: Math.round(this.weatherResponse.current.wind_speed*10)/10,
				},
				humidity: this.weatherResponse.current.humidity,
				pressure: Math.round(Units.hPa_to_mmHg(this.weatherResponse.current.pressure)),
				weatherId: this.weatherResponse.current.weather[0].id,
			}
		}

		public get daily(): WeatherDetailsInterface[] {
			return this.weatherResponse.daily.map(forecast => {
				return {
					dt: forecast.dt*1000,
					temperature: {
						min: Math.round(forecast.temp.min),
						max: Math.round(forecast.temp.max),
					},
					weatherId: forecast.weather[0].id,
				}
			})
		}
	}

	async function getWeather(city: string) {
		const owm = new OwmApi('181b73277597dc1293fdca01011e0b81');
		const geo = await owm.geo({ q: city });
		const weather = await  owm.oneCall({
			...OwmApi.geoToCoords(geo),
			exclude: 'minutely,hourly,alerts',
			units: 'metric',
			lang: 'en',
		});
		
		return {
			weatherResponse: weather,
			location: OwmApi.geoToLocation(geo),
		}
	}
	
	function localStorageCheck(name: string, deafault: string) {
		if(!localStorage.getItem(name)) {
			localStorage.setItem(name, deafault);
		}
	}

	type ThemeType = 'dark'|'light';
	type LangType = 'en'|'ru';
	function createCity() {
		localStorageCheck('city', 'london');

		const { subscribe, update, set } = writable<string>(localStorage.getItem('city'));
		
		return {
			subscribe,
			setCity: (name: string) => {
				localStorage.setItem('city', name);
				set(name);
			}
		}
	}
	function createTheme() {
		localStorageCheck('theme', 'dark');
		const { subscribe, update, set } = writable<ThemeType>(
			localStorage.getItem('theme') as ThemeType
		)

		return {
			subscribe,
			setTheme: (theme: ThemeType) => {
				localStorage.setItem('theme', theme);
				set(theme);
			}
		}
	}
	function createLang() {
		localStorageCheck('lang', 'en');
		document.getElementsByTagName('html')[0].lang = localStorage.getItem('lang');
		locale.set(localStorage.getItem('lang'));
		const { subscribe, update, set } = writable<LangType>(
			localStorage.getItem('lang') as LangType
		)

		return {
			subscribe,
			setLang: (lang: LangType) => {
				localStorage.setItem('lang', lang);
				document.getElementsByTagName('html')[0].lang = lang;
				locale.set(lang);
				set(lang);
			}
		}
	}
	let weatherData: Promise<Weather>
	const city = createCity();
	const lang = createLang();
	const inputValue = writable<string>(localStorage.getItem('city'));
	const theme = createTheme();
	
	city.subscribe(async name => {
		try {
			weatherData = Weather.create(name);
			city.setCity(
				(await weatherData).location.city[$lang]+', '+
				(await weatherData).location.country)
			$inputValue = $city
		} catch (error) {
			throw error
		}
	});

	function keydownInputHandler(e: KeyboardEvent) {
		switch (e.key) {
			case 'Enter':
				city.setCity($inputValue);
				break;
			default:
				break;
		}
	}

	function focusInputHandler() {
		this.select()
	}

	function searchButtonHandler() {
		city.setCity($inputValue)
	}

	function onChangeLanguageHandler() {
		if($lang === 'en') {
			lang.setLang('ru');
		} else {
			lang.setLang('en');
		}
	}
	function onChangeThemeHandler() {
		if($theme === 'dark') {
			theme.setTheme('light');
		} else {
			theme.setTheme('dark');
		}
	}
	let autosizeInputWidth: number;
</script>
{#if $isLoading}
 Loading
{:else}

{#await weatherData}
	Loading...
{:then weather}
<div id="app" class="theme-{$theme}">
	<header class="header">
		<div class="date">
			<FDate dt={weather.current.dt} offset={weather.timezoneOffset} size='full'/>
		</div>
		<!-- Date -->
		<div class="information">
			{$_('information.then.0')}
			<!-- information 0 -->
			<div class="autosize-input">
				<span 
					class="autosize-input__hidden"
					bind:offsetWidth={autosizeInputWidth}
				>{$inputValue}</span>
				<input 
					type="text" 
					bind:value={$inputValue} 
					on:keydown={keydownInputHandler}
					on:focus={focusInputHandler}
					style={"width:"+(autosizeInputWidth+22)+'px'}
					class="autosize-input__text"
				>
			</div>
			<button 
				on:click={searchButtonHandler} 
				class="button"
				disabled={!$inputValue||$inputValue===$city}
			>
				<Icon icon="flat-color-icons:search" inline={true}/>
			</button>
			<!-- Search -->
			<!-- <Icon icon="flag:{weather.location.country.toLocaleLowerCase()}-4x3" height='0.8rem' inline={true}/> -->
			{$_('information.then.1')} 
			{$_('weatherCondition.'+weather.current.weatherId)}.
		</div>
		<!-- Information -->
	</header>
	<!-- Header -->
	<main class="content">
		<div class="current">
			<Icon height='6rem' icon="{'wi:owm-'+weather.current.weatherId}"/>
			<div class="current__temperature">
				{weather.current.temperature.current}<Deg/>
			</div>
			<div class="current__details">
				<div class="details-item">
					<Icon icon="wi:humidity" height="1.5rem" /> {weather.current.humidity}%
				</div>
				<div class="details-item">
					<Icon icon="wi:barometer" height="1.5rem" /> {weather.current.pressure}{$_('units.mmHg')}
				</div>
				<div class="details-item">
					<Icon icon="wi:strong-wind" height="1.5rem" /> {weather.current.wind.speed}{$_('units.mps')}
					{$_('direction.'+weather.current.wind.direction)}
				</div>
			</div>
		</div>
		<!-- Current -->
		<div class="daily">
			{#each weather.daily.filter((v, i)=>i!==0 && i<5) as forecast, index}
				<div class="forecast-card">
					<Icon style="color: var(--accent-color)" height='4rem' icon="{'wi:owm-'+forecast.weatherId}"/>
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
		<button class="button" on:click={onChangeLanguageHandler}>
			{#if $lang==='en'}
				EN
			{:else}
				RU
			{/if}
		</button>
		<button class="button" on:click={onChangeThemeHandler}>
			{#if $theme==='light'}
				<Icon icon="twemoji:sun" inline={true} alt="Dark"/>
			{:else}
			<Icon icon="twemoji:crescent-moon" inline={true} alt="Light"/>
			{/if}
		</button>
	</footer>
	<!-- Footer -->
</div>
{:catch error}
	{error}
	<input on:click={()=>$inputValue = ''} bind:value={$inputValue} style="width:9rem;" type="text" placeholder="City, XX.">
	<button on:click={()=>city.setCity($inputValue)} class="button">search</button>
{/await}
{/if}
<style>
	#app {
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
		text-align: center;
	}
	.information {
		margin-top: 0.5rem;
	}
	.button {
		cursor: pointer;
		color: var(--text-color);
		padding: 0.3rem;
		transition: box-shadow 0.1s, color 0.1s, background-color 0.1s;
	}
	.button:hover {
		/* box-shadow: inset 0px 0px 0px 1px var(--accent-color); */
		background-color: var(--card-color);
	}
	.button:focus {
		box-shadow: inset 0px 0px 0px 1px #000;
	}
	.button:active {
		background-color: var(--accent-color);
		color: var(--text-color)
	}
	.button:disabled {
		cursor:not-allowed;
		background-color: var(--background-color);
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
	.autosize-input {
		display: inline;
	}
	.autosize-input__hidden,
	.autosize-input__text {
		font: inherit;
    margin: 0;
    padding: 0;
	}
	.autosize-input__text {
		border: none;
    border-bottom: 3px solid var(--text-accent-color);
    color: var(--text-accent-color);
    min-width: 2rem;
    max-width: 20rem;
    background-color: var(--back-ground-color);
    font-size: 1.2rem;
    text-align: center;
    font-weight: 500;
	}

	.autosize-input__text:focus-visible {
    outline: none;
  }

	.autosize-input__hidden {
		position: absolute;
    height: 0;
    overflow: hidden;
    white-space: pre;
    font-size: 1.2rem;
	}
</style>