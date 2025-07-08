<script>
	import composeButtonTypes from '$lib/schemas/compose-button-types';

	import { JDGButton } from 'jdg-ui-svelte';

	export let onClickFunction;
	export let tooltip = undefined;
	export let buttonType = composeButtonTypes.compose.type;
</script>

<div class="circular-action-button">
	<JDGButton
		{onClickFunction}
		label={null}
		faIcon={composeButtonTypes[buttonType].faIcon}
		textColor={composeButtonTypes[buttonType].color}
		backgroundColor={composeButtonTypes[buttonType].backgroundColor}
		doForceSquareRatio
		tooltip={tooltip ?? composeButtonTypes[buttonType].tooltip}
		fontSize="1.5rem"
		paddingLeftRight={'1rem'}
		paddingTopBottom={'1rem'}
	/>
</div>

<style>
	.circular-action-button {
		border-radius: 50%;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* subtle shadow */
		transition:
			box-shadow 0.2s ease,
			transform 0.2s ease;
	}
</style>
