<script>
	import { css } from '@emotion/css';
	import Portal from 'svelte-portal';

	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';

	import {
		getPersonById,
		upgradePersonData,
		setActivePerson,
		addActivePersonToPeopleArray
	} from '../../../logic/person-management';

	import { defaultPerson } from '../../../stores/relationship-map';
	import uiState from '../../../stores/ui-state';
	import stylingConstants from '../../stylingConstants';

	import Avatar from './Avatar.svelte';
	import NodeSettingsButton from './NodeSettings.svelte';
	import RelationshipTypePicker from './RelationshipTypePicker.svelte';
	import NameInput from './NameInput.svelte';
	import PersonNodeScrollingWindow from '../PersonNodeScrollingWindow/PersonNodeScrollingWindow.svelte';
	import Overlay from '../Overlay.svelte';
	import { showPersonDetailView } from '../../../logic/ui-management';

	export let sPersonId;
	export let sRelationshipId = undefined;
	export let bIsActivePerson = false;
	export let bIsNodeInEditMode = false;
	export let compatibleGroups = undefined;
	export let sNodeSize = stylingConstants.sizes.personNodeSize;

	let personNodeDynamicClass;

	$: {
		// is this node the active person?
		if (sPersonId === $uiState.activePerson.id) {
			bIsActivePerson = true;
		} else {
			bIsActivePerson = false;
		}

		// is this node in edit mode?
		if (sPersonId === $uiState.personIdForNodeEdit && sPersonId !== undefined) {
			bIsNodeInEditMode = true;
		} else {
			bIsNodeInEditMode = false;
		}

		personNodeDynamicClass = css`
			width: ${sNodeSize};
			height: ${sNodeSize};
			z-index: ${bIsNodeInEditMode ? `${stylingConstants.zIndices.personNodeEditZIndex}` : 'auto'};
			background-color: ${bIsActivePerson
				? stylingConstants.colors.activePersonNodeColor
				: stylingConstants.colors.personNodeColor};
			border: ${$uiState.personIdForNodeEdit == sPersonId ||
			$uiState.personIdForNodeSettingsFlyout == sPersonId
				? `2px solid ${stylingConstants.colors.hoverColor}`
				: '2px solid transparent'};
			:hover {
				border: 2px solid ${stylingConstants.colors.hoverColor};
			}
		`;
	}

	const onPersonNodeClickAction = () => {
		// don't do anything on click if the node is in edit mode
		if (bIsNodeInEditMode) {
			return;
		}

		// clicking on the active person will pull up the detailed view
		if (sPersonId === $uiState.activePerson.id) {
			showPersonDetailView();
		} else {
			// clicking on anyone else makes them the active person
			const upgradedPersonData = upgradePersonData(defaultPerson, getPersonById(sPersonId));
			setActivePerson(upgradedPersonData);
			addActivePersonToPeopleArray();
		}
	};

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

{#key sPersonId}
	<div
		id="person-node-{sPersonId}"
		class="person-node {personNodeDynamicClass}"
		on:click={onPersonNodeClickAction}
		on:keydown|stopPropagation
		in:receive={{ key: sPersonId }}
		out:send={{ key: sPersonId }}
	>
		<NodeSettingsButton {sPersonId} {sRelationshipId} {bIsNodeInEditMode} />
		<div id="person-node-content-area" class="person-node-content-area">
			<Avatar />
			<NameInput
				sInputValue={getPersonById(sPersonId)?.name}
				bEnabled={bIsNodeInEditMode}
				{sPersonId}
				{sRelationshipId}
				{bIsActivePerson}
			/>
			{#if sPersonId !== $uiState.activePerson.id}
				<RelationshipTypePicker
					bEnabled={bIsNodeInEditMode}
					{sPersonId}
					{sRelationshipId}
					sInputValue={sRelationshipId}
					{compatibleGroups}
				/>
			{/if}
		</div>
		{#if bIsNodeInEditMode && $uiState.personIdsOffScreenFiltered.length > 0}
			<PersonNodeScrollingWindow {sRelationshipId} />
		{/if}
	</div>
	{#if bIsNodeInEditMode}
		<Portal target="#app-container">
			<Overlay />
		</Portal>
	{/if}
{/key}

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

	.person-node-name {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
