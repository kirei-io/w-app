<script lang="ts">
	import './Global.css';
	import { _ } from 'svelte-i18n';
	import { city, inputValue, lang, theme } from './lib/stores';
	import Localization from './components/Localization.svelte';
	import { Weather } from './lib/Weather';
	import Header from './components/Header.svelte';
	import Footer from './components/Footer.svelte';
	import { Status } from './lib/Status';
	import Content from './components/Content.svelte';


	let weatherData: Promise<Weather>;
	let weatherExample = Weather.example();

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
	
</script>

<div id="app" class="theme-{$theme} flex_col">
	<Localization>
		<div class="wrapper flex_col">
			{#await weatherData}
				<Header status={Status.LOADING} weather={weatherExample}/>
				<Content status={Status.LOADING} weather={weatherExample}/>
				<Footer status={Status.LOADING}/>
				<!-- LOADING -->
			{:then weather}
				<Header weather={weather}/>
				<Content weather={weather}/>
				<Footer />
				<!-- DONE -->
			{:catch}
				<Header status={Status.ERROR} weather={weatherExample}/>
				<Content status={Status.ERROR} weather={weatherExample}/>
				<Footer status={Status.ERROR}/>
				<!-- ERROR -->
			{/await}
		</div>
	</Localization>
</div>

<style>
	#app {
		transition: color 0.1s, background-color 0.1s;
		background-color: var(--background-color);
		color: var(--text-color);
		height: 100%;
		justify-content: center;
	}
	.wrapper {
		padding: 1rem;
		align-items: center;
		gap: 4rem;
	}

	@media only screen and (max-width: 760px){
		#app {
			justify-content: start;
			height: 100vh;
		}
		.wrapper {
			gap: 1.5rem;
		}
	}
	@media only screen and (max-width: 760px) and (max-height: 825px) {
		#app {
			height: auto;
		}
	}
	@media only screen and (max-height: 760px) {
		#app {
			justify-content: start;
			height: 100vh;
		}
		.wrapper {
			gap: 1.5rem;
		}
	}
	@media only screen and (max-height: 590px) {
		#app {
			justify-content: start;
			height: auto;
		}
		.wrapper {
			gap: 1.5rem;
		}
	}

</style>