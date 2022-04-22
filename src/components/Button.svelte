<script lang="ts">
  export let disabled: boolean = false;
</script>

<button on:click disabled={disabled}>
  <slot></slot>
</button>

<style scoped>
  button {
		cursor: pointer;
		color: var(--text-color);
		padding: 0.3rem;
		transition: box-shadow 0.1s, color 0.1s, background-color 0.1s;
    margin: 0;
	}
	button:hover {
		/* box-shadow: inset 0px 0px 0px 1px var(--accent-color); */
		background-color: var(--card-color);
	}
	button:focus {
		box-shadow: inset 0px 0px 0px 1px #000;
	}
	button:active {
		background-color: var(--accent-color);
		color: var(--text-color)
	}
	button:disabled {
		cursor:not-allowed;
		background-color: var(--background-color);
	}
</style>