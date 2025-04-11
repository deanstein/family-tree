<script>
	import { css } from '@emotion/css';

	import stylingConstants from '$lib/components/styling-constants';

	export let enabled = true;
	export let onClickFunction = undefined;
	export let faIcon = 'fa-plus'; // default icon
	export let faIconFontSize = '1rem';
	export let iconColor = 'white';
	export let backgroundColor = stylingConstants.colors.activeColor;
	export let padding = '0.3rem';
	export let title = undefined;

	let circularButtonCss = css`
		font-size: ${faIconFontSize};
		padding: ${padding};
		color: ${iconColor};
		&:hover {
			background-color: ${stylingConstants.colors.hoverColor};
		}
	`;

	$: {
		// handle the override
		// for example, if the parent is hovered and the override is triggered
		circularButtonCss = css`
			${circularButtonCss}
			background-color: ${backgroundColor};
		`;
	}
</script>

<div class="circular-button-container">
	<button
		class="circular-button {circularButtonCss}"
		on:click={onClickFunction}
		on:keydown={onClickFunction}
		disabled={!enabled}
		title={title ?? ''}
	>
		<div class="circular-button-label">
			<i class="fa-solid {faIcon} fa-fw" />
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
		aspect-ratio: 1;
		cursor: pointer;
	}

	.circular-button-label {
		display: flex;
	}
</style>
