<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../../styling-constants';
	import {
		initializeAltNamesTempState,
		setBioEditId,
		unsetAltNames,
		unsetBioEditId
	} from '../../../logic/temp-management';

	import Button from '../../Button.svelte';

	export let personId;
	export let isBioEditActive;
	export let captureAllOriginalInputValues;
	export let saveAllInputs;
	export let discardAllInputs;

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

	const startBioEditingMode = () => {
		captureAllOriginalInputValues();
		setBioEditId(personId);
	};

	const endBioEditingModeAndSave = () => {
		saveAllInputs();
		unsetBioEditId();
	};

	const endBioEditingModeAndDiscard = () => {
		discardAllInputs();
		unsetBioEditId();
	};
</script>

<div id="edit-bio-button-container" class="edit-bio-button-container">
	{#if !isBioEditActive}
		<Button buttonText={'Edit Bio'} onClickFunction={startBioEditingMode} />
	{:else}
		<Button
			buttonText={'Cancel'}
			onClickFunction={endBioEditingModeAndDiscard}
			overrideBackgroundColor={stylingConstants.colors.buttonColorSecondary}
		/>
		<Button
			buttonText={'Done'}
			onClickFunction={endBioEditingModeAndSave}
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
