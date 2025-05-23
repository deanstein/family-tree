<script>
	import { css } from '@emotion/css';
	import { get } from 'svelte/store';

	import relationshipMap from '$lib/schemas/relationship-map';

	import { activePerson } from '$lib/states/family-tree-state';
	import {
		isNodeEditActive,
		nodeEditCompatibleGroups,
		nodeEditId,
		nodeEditRelationshipId
	} from '$lib/states/temp-state';

	import BioPhoto from '$lib/components/BioPhoto.svelte';
	import PersonNodeScrollingWindow from '$lib/components/NodeView/PersonNode/PersonNodeScrollingWindow.svelte';
	import NodeActionsButton from './NodeActionsButton.svelte';
	import Select from '$lib/components/Select.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import stylingConstants from '$lib/components/styling-constants';

	export let nameInputValue;
	export let relationshipInputValue = undefined;
	export let compatibleGroups = get(nodeEditCompatibleGroups);
	export let nodeSize = stylingConstants.sizes.personNodeSize;
	export let context;
	// in certain contexts, the PersonNodeForEdit can be hidden
	export let showHideButton = false;

	let personNodeCss;

	// ensures the input is focused when initialized
	const useFunction = (element) => {
		element.focus();
		element.select();
	};

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
		{#if showHideButton}
			<NodeActionsButton
				onClickFunction={() => {
					isNodeEditActive.set(false);
				}}
				faIcon={'fa-x'}
				faIconFontSize={'0.5rem'}
				iconColor={'white'}
				backgroundColor={stylingConstants.colors.activeColor}
				tooltip={'Cancel'}
			/>
		{/if}
		<BioPhoto personId={$nodeEditId} allowEdit={false} />
		<div class="person-node-inputs-container">
			<TextInput
				bind:inputValue={nameInputValue}
				placeholder={'Search...'}
				textAlignOverride="center"
				{useFunction}
			/>
			{#if $nodeEditId !== $activePerson.id && relationshipInputValue}
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
	<PersonNodeScrollingWindow
		relationshipId={$nodeEditRelationshipId}
		{context}
		filterInputValue={nameInputValue}
	/>
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
