<script lang="ts">
  import { city, inputValue } from "../lib/stores";

  let autosizeInputWidth: number;

  function keydownInputHandler(e: KeyboardEvent) {
		switch (e.key) {
			case 'Enter':
				city.set($inputValue);
				break;
			default:
				break;
		}
	}


	function focusInputHandler() {
		this.select()
	}

</script>


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

<style>
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