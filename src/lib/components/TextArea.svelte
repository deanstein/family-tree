<script>
	import { css } from '@emotion/css';

	import stylingConstants from '$lib/components/styling-constants';
	import { onMount } from 'svelte';

	export let isEnabled = true;
	export let inputValue = '';
	export let resizable = 'none'; // none, vertical, horizontal, or both
	export let minHeight = '100px';

	// empty function in case no function is passed to the input by the parent
	export let useFunction = (element) => {};

	let textArea;

	const textInputCss = css`
		border: 2px solid ${stylingConstants.colors.activeColor};
		resize: ${resizable};
		min-height: ${minHeight};
		:hover {
			border: 2px solid ${stylingConstants.colors.hoverColor};
		}
		:disabled {
			border-radius: ${stylingConstants.sizes.bioFieldBorderRadius};
		}
	`;

	const autoGrow = (textArea) => {
		textArea.style.height = textArea.scrollHeight + 'px';
	};

	onMount(() => {
		autoGrow(textArea);
	});
</script>

<div class="input-container">
	<textarea
		bind:value={inputValue}
		bind:this={textArea}
		use:useFunction
		class={textInputCss}
		disabled={!isEnabled}
		on:blur={() => autoGrow(textArea)}
	/>
</div>

<style>
	.input-container {
		display: flex;
		height: 100%;
	}

	textarea {
		height: min-content;
		width: 100%;
		outline: none;
		padding: 4px;
	}

	textarea:disabled {
		background-color: white;
		border: 2px solid transparent;
	}
</style>
