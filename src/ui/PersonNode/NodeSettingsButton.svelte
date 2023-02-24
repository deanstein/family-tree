<script>
	import { css } from '@emotion/css';

	import uiState from '../../stores/uiState';
	import stylingConstants from '../../stores/stylingConstants';

	export let sPersonId;
	export let bIsNodeInEditMode;

	export const startEditingMode = () => {
		uiState.update((currentValue) => {
			currentValue.sPersonIdForNodeEdit = sPersonId;
			return currentValue;
		});
	};

	export const endEditingMode = () => {
		uiState.update((currentValue) => {
			currentValue.sPersonIdForNodeEdit = undefined;
			return currentValue;
		});
	};

	let buttonText;
	let settingsButtonDynamicClass;
	$: {
		buttonText = bIsNodeInEditMode ? 'done' : '...';

		settingsButtonDynamicClass = css`
			color: ${bIsNodeInEditMode ? 'white' : 'black'};
			background-color: ${bIsNodeInEditMode ? 'green' : stylingConstants.colors.sPersonNodeColor};
			border: 1px solid transparent;
			:hover {
				1px solid ${stylingConstants.colors.sActiveInputHighlightColor}
			}
		`;
	}
</script>

<div id="settings-button-container" class="settings-button-container">
	<button
		type="button"
		id="settings-button"
		class="{settingsButtonDynamicClass} settings-button"
		on:click|stopPropagation={bIsNodeInEditMode ? endEditingMode : startEditingMode}
		>{buttonText}</button
	>
</div>

<style>
	.settings-button-container {
		position: relative;
		width: 100%;
		height: 100%;
		float: right;
	}

	.settings-button {
		position: absolute;
		top: 0px;
		right: 0px;
		border: none;
		letter-spacing: 2px;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		font-weight: bold;
	}
</style>
