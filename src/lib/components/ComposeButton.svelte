<script>
	import { css } from '@emotion/css';
	import composeButtonTypes from '$lib/schemas/compose-button-types';

	import { JDGButton } from 'jdg-ui-svelte';
	import stylingConstants from './styling-constants';

	export let onClickFunction;
	export let faIcon = undefined;
	export let label = null;
	export let tooltip = undefined;
	export let buttonType = composeButtonTypes.edit.type;

	let isCircular =
		buttonType === composeButtonTypes.add.type || buttonType === composeButtonTypes.edit.type
			? true
			: false;

	const composeButtonCss = css`
		border-radius: ${isCircular ? '50%' : '1.5rem'};
	`;
</script>

<div class="compose-button {composeButtonCss}">
	<JDGButton
		{onClickFunction}
		label={buttonType === composeButtonTypes.add.type || buttonType === composeButtonTypes.edit.type
			? null
			: label}
		faIcon={faIcon ?? composeButtonTypes[buttonType].faIcon}
		textColor={composeButtonTypes[buttonType].color}
		backgroundColor={composeButtonTypes[buttonType].backgroundColor}
		backgroundColorHover={buttonType === composeButtonTypes.add.type ||
		buttonType === composeButtonTypes.edit.type
			? stylingConstants.colors.activePersonNodeColor
			: undefined}
		doForceSquareRatio={isCircular}
		tooltip={tooltip ?? composeButtonTypes[buttonType].tooltip}
		fontSize={buttonType === composeButtonTypes.add.type ||
		buttonType === composeButtonTypes.edit.type
			? '1.5rem'
			: '0.9rem'}
		paddingLeftRight={buttonType === composeButtonTypes.add.type ||
		buttonType === composeButtonTypes.edit.type
			? '1rem'
			: '0.5rem'}
		paddingTopBottom={buttonType === composeButtonTypes.add.type ||
		buttonType === composeButtonTypes.edit.type
			? '1rem'
			: '0.25rem'}
	/>
</div>

<style>
	.compose-button {
		height: fit-content;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.4); /* subtle shadow */
		transition:
			box-shadow 0.2s ease,
			transform 0.2s ease;
		pointer-events: all;
	}
</style>
