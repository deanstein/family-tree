<script>
	import { css } from '@emotion/css';

	import stylingConstants from '$lib/components/styling-constants';

	export let enabled = true;
	export let onClickFunction = undefined;
	export let faIcon = 'fa-plus'; // default icon
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

<div class="circular-button-container">
	<button
		class="circular-button {circularButtonCss}"
		on:click={onClickFunction}
		on:keydown={onClickFunction}
		disabled={!enabled}
	>
		<div class="circular-button-label">
			<i class="fa-solid {faIcon}" />
		</div>
	</button>
</div>

<style>
	.circular-button {
		border: none;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		cursor: pointer;
	}

	.circular-button-label {
		display: flex;
	}
</style>
