<script lang="ts">
  import Icon from "@iconify/svelte";

  import { _ } from "svelte-i18n";
  import { Status } from "../lib/Status";
  import { Lang, lang, theme, Theme } from "../lib/stores";
  import Button from "./Button.svelte";

  export let status: Status = Status.DONE;

  const disabled = status !== Status.DONE

  function onChangeLanguageHandler() {
		if($lang === Lang.EN) {
			lang.set(Lang.RU);
		} else {
			lang.set(Lang.EN);
		}
	}

	function onChangeThemeHandler() {
		if($theme === Theme.DARK) {
			theme.set(Theme.LIGHT);
		} else {
			theme.set(Theme.DARK);
		}
	}
</script>

<footer>
  <Button class='footer__button' on:click={onChangeLanguageHandler} disabled={disabled}>
    {$_('button.'+$lang)}
  </Button>
  <!-- switch lang button -->
  <Button class='footer__button' on:click={onChangeThemeHandler} disabled={disabled}>
    {#if $theme === Theme.LIGHT}
      <Icon icon="twemoji:sun" inline={true} alt="Dark"/>
    {:else}
      <Icon icon="twemoji:crescent-moon" inline={true} alt="Light"/>
    {/if}
  </Button>
  <!-- switch theme button -->
</footer>

<style>
  
</style>