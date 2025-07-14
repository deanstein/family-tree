<script>
	import composeButtonTypes from '$lib/schemas/compose-button-types';

	import { JDGButton } from 'jdg-ui-svelte';
	import stylingConstants from './styling-constants';

	export let onClickFunction;
	export let label = null;
	export let tooltip = undefined;
	export let buttonType = composeButtonTypes.edit.type;
</script>

<div class="circular-action-button">
	<JDGButton
		{onClickFunction}
		label={buttonType === composeButtonTypes.add.type || buttonType === composeButtonTypes.edit.type
			? null
			: label}
		faIcon={composeButtonTypes[buttonType].faIcon}
		textColor={composeButtonTypes[buttonType].color}
		backgroundColor={composeButtonTypes[buttonType].backgroundColor}
		backgroundColorHover={buttonType === composeButtonTypes.add.type ||
		buttonType === composeButtonTypes.edit.type
			? stylingConstants.colors.activePersonNodeColor
			: undefined}
		doForceSquareRatio={buttonType === composeButtonTypes.add.type ||
		buttonType === composeButtonTypes.edit.type
			? true
			: false}
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
	.circular-action-button {
		height: fit-content;
		border-radius: 50%;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* subtle shadow */
		transition:
			box-shadow 0.2s ease,
			transform 0.2s ease;
	}
</style>
