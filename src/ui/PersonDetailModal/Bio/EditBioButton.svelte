<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../../styling-constants';
	import { setBioEditId, unsetBioEditId } from '../../../logic/temp-management';

	import Button from '../../Button.svelte';
	import { checkForUnsavedChanges } from '../../../logic/ui-management';

	export let personId;
	export let isBioEditActive;
	export let initializeAllInputs;
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
		initializeAllInputs();
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

	.edit-bio-button {
		position: absolute;
		top: 0px;
		right: 0px;
		border: none;
		letter-spacing: 2px;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		font-weight: bold;
	}

	.edit-bio-flyout-menu {
		position: relative;
		top: 0;
		left: 100%;
		width: 200px;
	}
</style>
