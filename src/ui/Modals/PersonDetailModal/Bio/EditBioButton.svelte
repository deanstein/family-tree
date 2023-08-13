<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../../../styling-constants';

	import Button from '../../../Button.svelte';

	export let isBioEditActive;
	export let onBioEditButtonClick;
	export let onDoneButtonClick;
	export let onCancelButtonClick;

	let settingsButtonText;
	let nodeSettingsButtonDynamicClass;

	$: {
		settingsButtonText = isBioEditActive ? 'Done' : 'Edit Bio';

		nodeSettingsButtonDynamicClass = css`
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

<div id="edit-bio-button-container" class="edit-bio-button-container">
	{#if !isBioEditActive}
		<Button buttonText={'Edit Bio'} onClickFunction={onBioEditButtonClick} />
	{:else}
		<Button
			buttonText={'Cancel'}
			onClickFunction={onCancelButtonClick}
			overrideBackgroundColor={stylingConstants.colors.buttonColorSecondary}
		/>
		<Button
			buttonText={'Done'}
			onClickFunction={onDoneButtonClick}
			overrideBackgroundColor={stylingConstants.colors.buttonColorDone}
		/>
	{/if}
</div>

<style>
	.edit-bio-button-container {
		width: 100%;
		float: right;
	}
</style>
