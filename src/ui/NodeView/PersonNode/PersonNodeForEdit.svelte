<script>
	import { css } from '@emotion/css';
	import { onMount } from 'svelte';
	import Portal from 'svelte-portal';

	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';

	import relationshipMap from '../../../schemas/relationship-map';
	import tempState from '../../../stores/temp-state';
	import uiState from '../../../stores/ui-state';
	import stylingConstants from '../../styling-constants';

	import Avatar from './Avatar.svelte';
	import PersonNodeScrollingWindow from '../PersonNodeScrollingWindow/PersonNodeScrollingWindow.svelte';
	import Select from '../../Select.svelte';
	import TextInput from '../../TextInput.svelte';

	import { updateFilteredOffScreenPeopleIdsArray } from '../../../logic/ui-management';

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
		}
	};

	$: {
		personNodeDynamicClass = css`
			width: ${nodeSize};
			height: ${nodeSize};
			background-color: ${stylingConstants.colors.personNodeColor};
			border: 2px solid ${stylingConstants.colors.activeColor};
		`;
	}

	onMount(() => {
		updateFilteredOffScreenPeopleIdsArray(nameInputValue);
	});

	const personNodeContentAreaDynamicClass = css`
		margin-top: ${stylingConstants.sizes.padding};
	`;

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 300,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});
</script>

<div
	id="person-node-{$tempState.nodeActionsModalPersonId}"
	class="person-node {personNodeDynamicClass}"
>
	<div
		id="person-node-content-area"
		class="{personNodeContentAreaDynamicClass} person-node-content-area"
	>
		<Avatar />
		<div id="person-node-inputs-container" class="person-node-inputs-container">
			<TextInput
				bind:inputValue={nameInputValue}
				textAlignOverride="center"
				useFunction={isNewPerson ? useFunction : undefined}
				{onKeyUpFunction}
			/>
			{#if $tempState.nodeEditPersonId !== $uiState.activePerson.id}
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
	{#if $uiState.personIdsOffScreenFiltered.length > 0}
		<PersonNodeScrollingWindow sRelationshipId={$tempState.nodeEditRelationshipId} />
	{/if}
</div>

<style>
	.person-node {
		display: flex;
		position: relative;
		flex-direction: column;
		align-items: center;
		justify-content: center;
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
