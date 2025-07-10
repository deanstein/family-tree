<script>
	import { css } from '@emotion/css';

	import composeButtonTypes from '$lib/schemas/compose-button-types';

	import ButtonCompose from '../ButtonCompose.svelte';
	import stylingConstants from '$lib/components/styling-constants';

	export let isBioEditActive;
	export let onBioEditButtonClick;
	export let onDoneButtonClick;
	export let onCancelButtonClick;

	let settingsButtonText;
	let nodeSettingsButtonCss;

	$: {
		settingsButtonText = isBioEditActive ? 'Done' : 'Edit Bio';

		nodeSettingsButtonCss = css`
			z-index: ${stylingConstants.zIndices.personNodeSettingsZIndex};
			color: ${isBioEditActive ? 'white' : 'black'};
			background-color: ${isBioEditActive ? 'green' : 'transparent'};
			border: 2px solid transparent;
			font-size: ${stylingConstants.sizes.personNodeFontSize};
			:hover {
				background-color: ${stylingConstants.colors.hoverColor};
			}
		`;
	}
</script>

<div class="edit-bio-button-container">
	{#if !isBioEditActive}
		<ButtonCompose
			onClickFunction={onBioEditButtonClick}
			tooltip={"Edit this person's bio"}
			buttonType={composeButtonTypes.edit.type}
		/>
	{:else}
		<ButtonCompose
			onClickFunction={onCancelButtonClick}
			buttonType={composeButtonTypes.cancel.type}
		/>
		<ButtonCompose
			onClickFunction={onDoneButtonClick}
			buttonType={composeButtonTypes.confirm.type}
		/>
	{/if}
</div>

<style>
	.edit-bio-button-container {
		display: flex;
		gap: 10px;
		width: 100%;
		float: right;
	}
</style>
