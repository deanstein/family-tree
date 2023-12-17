<script>
	import { css } from '@emotion/css';
	import { onMount } from 'svelte';

	import relationshipMap from '$lib/schemas/relationship-map';
	import tempState from '$lib/stores/temp-state';
	import uiState from '$lib/stores/ui-state';
	
	import stylingConstants from '$lib/components/styling-constants';

	import {
		updateOffScreenPeopleIdsArray,
		updateFilteredOffScreenPeopleIdsArray,
		initializeOffScreenPeopleIdsArray
	} from '$lib/temp-management';

	import BioPhoto from '$lib/components/BioPhoto.svelte';
	import PersonNodeScrollingWindow from '$lib/components/NodeView/PersonNode/PersonNodeScrollingWindow.svelte';
	import Select from '$lib/components/Select.svelte';
	import TextInput from '$lib/components/TextInput.svelte';

	export let nameInputValue;
	export let relationshipInputValue;
	export let compatibleGroups = $tempState.nodeEditCompatibleGroups;
	export let nodeSize = stylingConstants.sizes.personNodeSize;
	export let isNewPerson = undefined;

	let personNodeDynamicClass;

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
		personNodeDynamicClass = css`
			width: ${nodeSize};
			height: ${nodeSize};
			background-color: ${stylingConstants.colors.personNodeColor};
			border: 2px solid ${stylingConstants.colors.activeColor};
		`;
	}

	const personNodeContentAreaDynamicClass = css`
		margin-top: ${stylingConstants.sizes.padding};
	`;
</script>

<div
	id="person-node-{$tempState.nodeActionsModalPersonId}"
	class="person-node {personNodeDynamicClass}"
>
	<div
		id="person-node-content-area"
		class="{personNodeContentAreaDynamicClass} person-node-content-area"
	>
		<BioPhoto personId={$tempState.nodeActionsModalPersonId} allowEdit={false} />

		<div id="person-node-inputs-container" class="person-node-inputs-container">
			<TextInput
				bind:inputValue={nameInputValue}
				textAlignOverride="center"
				useFunction={isNewPerson ? useFunction : undefined}
				{onKeyUpFunction}
			/>
			{#if $tempState.nodeActionsModalPersonId !== $uiState.activePerson.id}
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
		<PersonNodeScrollingWindow relationshipId={$tempState.nodeEditRelationshipId} />
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
