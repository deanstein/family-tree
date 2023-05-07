<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../../styling-constants';

	import Button from '../../Button.svelte';

	export let personId;
	export let isBioEditActive;

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

	export let startBioEditingMode;
	export let endBioEditingModeAndSave;
	export let endBioEditingModeAndDiscard;
</script>

<div id="edit-bio-button-container" class="edit-bio-button-container">
	{#if !isBioEditActive}
		<Button buttonText={'Edit Bio'} onClickFunction={startBioEditingMode} />
	{:else}
		<Button buttonText={'Cancel'} onClickFunction={endBioEditingModeAndDiscard} />
		<Button buttonText={'Done'} onClickFunction={endBioEditingModeAndSave} />
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
