<script>
	import { css } from '@emotion/css';

	import { onMount } from 'svelte';
	import { onDestroy } from 'svelte';
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';

	import {
		getPersonById,
		upgradePersonData,
		setActivePerson,
		addPersonIdToActiveRelatedPeopleIdsArray,
		removePersonIdFromActiveRelatedPeopleIdsArray,
		addActivePersonToPeopleArray
	} from '../../../logic/personManagement';

	import { defaultPerson } from '../../../stores/relationshipMap';
	import familyTreeData from '../../../stores/familyTreeData';
	import uiState from '../../../stores/uiState';
	import stylingConstants from '../../../stores/stylingConstants';

	import Avatar from './Avatar.svelte';
	import NodeSettingsButton from './NodeSettings.svelte';
	import RelationshipTypePicker from './RelationshipTypePicker.svelte';
	import NameInput from './NameInput.svelte';
	import PersonNodeScrollingWindow from '../PersonNodeScrollingWindow/PersonNodeScrollingWindow.svelte';

	export let sPersonId;
	export let sRelationshipId = undefined;
	export let bIsActivePerson = false;
	export let bIsNodeInEditMode = false;
	export let compatibleGroups = undefined;

	let personNodeDynamicClass;
	let personNodeOverlayDynamicClass;

	$: {
		// is this node the active person?
		if (sPersonId === $familyTreeData.activePerson.id) {
			bIsActivePerson = true;
		} else {
			bIsActivePerson = false;
		}

		// is this node in edit mode?
		if (sPersonId === $uiState.sPersonIdForNodeEdit && sPersonId != undefined) {
			bIsNodeInEditMode = true;
		} else {
			bIsNodeInEditMode = false;
		}

		personNodeDynamicClass = css`
			width: ${stylingConstants.sizes.personNodeSize};
			height: ${stylingConstants.sizes.personNodeSize};
			z-index: ${bIsNodeInEditMode ? `${stylingConstants.zIndices.nPersonNodeEditZIndex}` : 'auto'};
			background-color: ${stylingConstants.colors.sPersonNodeColor};
			border: ${$uiState.sPersonIdForNodeEdit == sPersonId ||
			$uiState.sPersonIdForNodeSettingsFlyout == sPersonId
				? `2px solid ${stylingConstants.colors.sHoverColor}`
				: '2px solid transparent'};
			:hover {
				border: 2px solid ${stylingConstants.colors.sHoverColor};
			}
		`;

		personNodeOverlayDynamicClass = css`
			z-index: ${stylingConstants.zIndices.nPersonNodeOverlayZIndex};
			background-color: ${stylingConstants.colors.sOverlayColor};
			opacity: ${stylingConstants.colors.overlayOpacity};
		`;
	}

	const onPersonNodeClickAction = () => {
		// don't do anything on click if the node is in edit mode
		if (bIsNodeInEditMode) {
			return;
		}

		// clicking on the active person will pull up the detailed view
		if (sPersonId === $familyTreeData.activePerson.id) {
			// TODO: show person detail view
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

	onMount(() => {
		addPersonIdToActiveRelatedPeopleIdsArray(sPersonId);
	});

	onDestroy(() => {
		removePersonIdFromActiveRelatedPeopleIdsArray(sPersonId);
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
			{#if sPersonId !== $familyTreeData.activePerson.id}
				<RelationshipTypePicker
					bEnabled={bIsNodeInEditMode}
					{sPersonId}
					{sRelationshipId}
					sInputValue={sRelationshipId}
					{compatibleGroups}
				/>
			{/if}
		</div>
		{#if bIsNodeInEditMode && $familyTreeData.aAvailablePeopleIdsFiltered.length > 0}
			<PersonNodeScrollingWindow {sRelationshipId} />
		{/if}
	</div>
	{#if bIsNodeInEditMode}
		<div id="person-node-overlay" class="{personNodeOverlayDynamicClass} person-node-overlay" />
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

	.person-node-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
	}
</style>
