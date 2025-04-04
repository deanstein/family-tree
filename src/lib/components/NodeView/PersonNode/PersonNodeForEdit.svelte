<script>
	import { css } from '@emotion/css';
	import { onMount } from 'svelte';

	import relationshipMap from '$lib/schemas/relationship-map';
	import tempState from '$lib/stores/temp-state';
	import uiState from '$lib/stores/ui-state';
	import {
		updateOffScreenPeopleIdsArray,
		updateFilteredOffScreenPeopleIdsArray,
		initializeOffScreenPeopleIdsArray
	} from '$lib/temp-management';

	import BioPhoto from '$lib/components/BioPhoto.svelte';
	import PersonNodeScrollingWindow from '$lib/components/NodeView/PersonNode/PersonNodeScrollingWindow.svelte';
	import Select from '$lib/components/Select.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import stylingConstants from '$lib/components/styling-constants';

	export let nameInputValue;
	export let relationshipInputValue = undefined;
	export let compatibleGroups = $tempState.nodeEditCompatibleGroups;
	export let nodeSize = stylingConstants.sizes.personNodeSize;
	export let isNewPerson = undefined;
	export let context;

	let personNodeCss;

	const useFunction = (element) => {
		element.focus();
		element.select();
	};

	const onKeyUpFunction = (event) => {
		updateFilteredOffScreenPeopleIdsArray(event.target.value);
		if (event.keyCode === 13) {
			// TO DO: ensure enter acts as Done
		}
	};

	onMount(() => {
		initializeOffScreenPeopleIdsArray();
		updateOffScreenPeopleIdsArray();
		updateFilteredOffScreenPeopleIdsArray(nameInputValue);
	});

	$: {
		personNodeCss = css`
			width: ${nodeSize};
			height: ${nodeSize};
			background-color: ${stylingConstants.colors.personNodeColor};
			border: 2px solid ${stylingConstants.colors.activeColor};
		`;
	}

	const personNodeContentAreaCss = css`
		margin-top: ${stylingConstants.sizes.padding};
	`;
</script>

<div class="person-node {personNodeCss}">
	<div class="person-node-content-area {personNodeContentAreaCss}">
		<BioPhoto personId={$tempState.nodeActionsModalPersonId} allowEdit={false} />

		<div class="person-node-inputs-container">
			<TextInput
				bind:inputValue={nameInputValue}
				textAlignOverride="center"
				useFunction={isNewPerson ? useFunction : undefined}
				{onKeyUpFunction}
			/>
			{#if $tempState.nodeActionsModalPersonId !== $uiState.activePerson.id && relationshipInputValue}
				<div class="select-container">
					<Select
						optionValueKey="id"
						bind:inputValue={relationshipInputValue}
						optionsGroupObject={compatibleGroups
							? compatibleGroups
							: JSON.parse(JSON.stringify(relationshipMap))}
						textAlignOverride="center"
					/>
				</div>
			{/if}
		</div>
	</div>
	{#if $tempState.personIdsOffScreenFiltered.length > 0}
		<PersonNodeScrollingWindow relationshipId={$tempState.nodeEditRelationshipId} {context} />
	{/if}
</div>

<style>
	.person-node {
		display: flex;
		position: relative;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
	}

	.person-node-content-area {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.person-node-inputs-container {
		display: flex;
		flex-direction: column;
		padding: 10px;
	}

	.person-node-name {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.select-container {
		margin-top: -1px;
	}
</style>
