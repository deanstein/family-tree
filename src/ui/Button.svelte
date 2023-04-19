<script>
	import { css } from '@emotion/css';

	import stylingConstants from './stylingConstants';

	export let buttonText;
	export let onClickFunction;

	const buttonDynamicClass = css`
		background-color: ${stylingConstants.colors.buttonColor};
		:hover {
			background-color: ${stylingConstants.colors.hoverColor};
		}
	`;
</script>

<button on:click={onClickFunction} class={buttonDynamicClass}>
	{buttonText}
</button>

<style>
	button {
		padding: 15px;
		color: white;
		border: none;
		font-weight: bold;
	}
</style>
