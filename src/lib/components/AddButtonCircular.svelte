<script>
	import { css } from '@emotion/css';
	import stylingConstants from './styling-constants';

	export let onClickFunction = undefined;
	export let colorOverride = undefined;

	let circularButtonCss = css`
		width: ${stylingConstants.sizes.personNodeAddButtonSize};
		height: ${stylingConstants.sizes.personNodeAddButtonSize};
		color: white;
		&:hover {
			background-color: ${stylingConstants.colors.hoverColor};
		}
	`;

	$: {
		// handle the override
		// for example, if the parent is hovered and the override is triggered
		circularButtonCss = css`
			${circularButtonCss}
			background-color: ${colorOverride ? colorOverride : stylingConstants.colors.activeColor};
		`;
	}
</script>

<div id="circular-button-container" class="circular-button-container">
	<div
		id="circular-button"
		class="{circularButtonCss} circular-button"
		on:click={onClickFunction}
		on:keydown={onClickFunction}
	>
		<div id="circular-button-label" class="circular-button-label">+</div>
	</div>
</div>

<style>
	.circular-button {
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		cursor: pointer;
	}

	.circular-button-label {
		font-size: 3vh;
	}
</style>
