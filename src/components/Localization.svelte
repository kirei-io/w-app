<script lang="ts">
import { isLoading, locale } from "svelte-i18n";
import '../lib/i18n';
import { lang } from "../lib/stores";

lang.subscribe(value => {
  locale.set(value);
})

</script>

{#if $isLoading}
  <div class="Localisation">
    Loading localization...
  </div>
{:else}
  <slot></slot>
{/if}