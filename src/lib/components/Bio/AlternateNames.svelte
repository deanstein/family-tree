<script>
	import { css } from '@emotion/css';

	import alternateName from '$lib/schemas/alternate-name';

	import { bioEditAltName, bioEditAltNames } from '$lib/states/temp-state';
	import { activePerson } from '$lib/states/ui-state';
	import stylingConstants from '$lib/components/styling-constants';

	import AlternateName from '$lib/components/Bio/AlternateName.svelte';
	import ButtonCircular from '$lib/components/ButtonCircular.svelte';

	import { instantiateObject } from '$lib/utils';

	export let isEnabled = true;

	let addAlternateNameButtonAction = () => {
		// get or create a name from the uiState
		const newAlternateName = instantiateObject(alternateName);
		// mark the object as the active editing name from the uiState
		bioEditAltName.set(newAlternateName);
	};

	let altNamesContainerCss = css`
		border: 2px solid ${stylingConstants.colors.activeColor};
		:hover {
			border: 2px solid ${stylingConstants.colors.hoverColor};
		}
	`;

	let altNamesContainerDisabledCss = css`
		border: 2px solid transparent;
		border-radius: ${stylingConstants.sizes.bioFieldBorderRadius};
		:hover {
			border: 2px solid none;
		}
	`;
</script>

<div
	class="bio-alt-names-container {isEnabled ? altNamesContainerCss : altNamesContainerDisabledCss} "
>
	<div class="alt-names-scrollable-container">
		{#each isEnabled ? $bioEditAltNames : $activePerson.alternateNames as alternateName}
			<AlternateName {isEnabled} {alternateName} />
		{/each}
	</div>
	<div class="add-button-container">
		{#if isEnabled}
			<ButtonCircular onClickFunction={addAlternateNameButtonAction} />
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
