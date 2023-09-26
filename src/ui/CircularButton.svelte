<script>
	import { css } from '@emotion/css';
	import stylingConstants from './styling-constants';

	export let buttonText = '+';
	export let onClickFunction = undefined;

	const circularButtonDynamicClass = css`
		width: ${stylingConstants.sizes.personNodeAddButtonSize};
		height: ${stylingConstants.sizes.personNodeAddButtonSize};
		-moz-border-radius: ${stylingConstants.sizes.personNodeAddButtonRadius};
		-webkit-border-radius: ${stylingConstants.sizes.personNodeAddButtonRadius};
		border-radius: ${stylingConstants.sizes.personNodeAddButtonRadius};
		color: white;
		background-color: ${stylingConstants.colors.activeColor};
		:hover {
			background-color: ${stylingConstants.colors.hoverColor};
		}
	`;
</script>

<div id="circular-button-container" class="circular-button-container">
	<div
		id="circular-button"
		class="{circularButtonDynamicClass} circular-button"
		on:click={onClickFunction}
		on:keydown={onClickFunction}
	>
		<div id="circular-button-label" class="circular-button-label">{buttonText}</div>
	</div>
</div>

<style>
	.circular-button {
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}

	.circular-button-label {
		font-size: 3vh;
	}
</style>
