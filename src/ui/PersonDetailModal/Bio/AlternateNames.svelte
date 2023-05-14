<script>
	import { css } from '@emotion/css';

	import uiState from '../../../stores/ui-state';
	import tempState from '../../../stores/temp-state';
	import stylingConstants from '../../styling-constants';

	import CircuarButton from '../../CircuarButton.svelte';
	import AlternateName from './AlternateName.svelte';

	import { setEditAltName } from '../../../logic/temp-management';
	import { instantiateObject } from '../../../logic/utils';
	import { alternateName } from '../../../schemas/alternate-name';

	export let isEnabled = true;
	export let inputValue;

	let addAlternateNameButtonAction = () => {
		// get or create a name from the uiState
		const newAlternateName = instantiateObject(alternateName);
		// mark the object as the active editing name from the uiState
		setEditAltName(newAlternateName);
	};

	let altNamesContainerDynamicClass = css`
		border: 2px solid ${stylingConstants.colors.activeColor};
		:hover {
			border: 2px solid ${stylingConstants.colors.hoverColor};
		}
	`;

	let altNamesContainerDisabledDynamicClass = css`
		border: 2px solid transparent;
		:hover {
			border: 2px solid none;
		}
	`;

	$: {
		// when enabled, set the input value to the tempState, since we're editing
		if (isEnabled) {
			inputValue = $tempState.altNames;
			// but when disabled, set the input value to the uiState, which is the source of truth
		} else {
			inputValue = $uiState.activePerson.alternateNames;
		}
	}
</script>

<div
	id="bio-alt-names-container"
	class="{isEnabled
		? altNamesContainerDynamicClass
		: altNamesContainerDisabledDynamicClass} bio-alt-names-container"
>
	<div id="alt-names-scrollable-container" class="alt-names-scrollable-container">
		{#each isEnabled ? $tempState.altNames : $uiState.activePerson.alternateNames as alternateName}
			<AlternateName {isEnabled} {alternateName} />
		{/each}
	</div>
	<div id="add-button-container" class="add-button-container">
		{#if isEnabled}
			<CircuarButton onClickFunction={addAlternateNameButtonAction} />
		{/if}
	</div>
</div>

<style>
	.bio-alt-names-container {
		display: flex;
		justify-content: right;
		align-items: center;
		height: 2vw;
		background-color: white;
	}

	.alt-names-scrollable-container {
		display: flex;
		padding: 10px;
		height: 100%;
		flex-grow: 1;
		overflow-y: auto;
		gap: 0.5vw;
	}

	.add-button-container {
		padding-left: 10px;
		padding-right: 10px;
	}
</style>
