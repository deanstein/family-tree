<script>
	import { css } from '@emotion/css';
	import { afterUpdate, onDestroy } from 'svelte';
	import Portal from 'svelte-portal';

	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';

	import {
		getPersonById,
		setActivePerson,
		addActivePersonToPeopleArray,
		getRelationshipNameById
	} from '../../../logic/person-management';

	import uiState from '../../../stores/ui-state';
	import tempState from '../../../stores/temp-state';
	import stylingConstants from '../../styling-constants';

	import Avatar from './Avatar.svelte';
	import NodeActionsButton from './NodeActionsButton.svelte';
	import RelationshipLabel from './RelationshipLabel.svelte';
	import NameLabel from './NameLabel.svelte';
	import PersonNodeScrollingWindow from '../PersonNodeScrollingWindow/PersonNodeScrollingWindow.svelte';
	import Overlay from '../Overlay.svelte';
	import {
		addOrUpdatePersonNodePosition as addOrUpdatePersonNodePosition,
		clearCanvas,
		getDivCentroid,
		removePersonNodePosition,
		showPersonDetailView
	} from '../../../logic/ui-management';
	import { drawNodeConnectionLine } from '../../graphics-factory';
	addOrUpdatePersonNodePosition;

	export let sPersonId;
	export let sRelationshipId = undefined;
	export let groupId = undefined;
	export let bIsActivePerson = false;
	export let bIsNodeInEditMode = false;
	export let compatibleGroups = undefined;
	export let sNodeSize = stylingConstants.sizes.personNodeSize;

	let personNodeDynamicClass;
	let name;
	let relationshipLabel;
	let nodeDivRef;
	let centroid;

	$: {
		name = getPersonById(sPersonId)?.name;
		relationshipLabel = getRelationshipNameById(sRelationshipId, compatibleGroups);

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

	$: {
		addOrUpdatePersonNodePosition(sPersonId, centroid);
	}

	afterUpdate(() => {
		if (nodeDivRef && !bIsActivePerson) {
			centroid = getDivCentroid(nodeDivRef);
			// ensure this node's position is added or updated so we can draw a line from it
			addOrUpdatePersonNodePosition(sPersonId, centroid);
		}
	});

	onDestroy(() => {
		// remove this node's position so no line is drawn to it
		removePersonNodePosition(sPersonId);
	});

	const personNodeContentAreaDynamicClass = css`
		padding-top: ${stylingConstants.sizes.padding};
	`;

	const onPersonNodeMouseEnterAction = () => {
		// on hover, draw a thicker connection line
		drawNodeConnectionLine(
			$uiState.personNodeConnectionLineCanvasHover.getContext('2d'),
			getDivCentroid(nodeDivRef),
			stylingConstants.sizes.nPersonNodeConnectionLineThicknessHover,
			stylingConstants.colors.hoverColor
		);
	};

	const onPersonNodeMouseLeaveAction = () => {
		// on blur, clear the hover canvas entirely
		clearCanvas($uiState.personNodeConnectionLineCanvasHover);
	};

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
			setActivePerson(getPersonById(sPersonId));
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
		on:mouseenter={onPersonNodeMouseEnterAction}
		on:mouseleave={onPersonNodeMouseLeaveAction}
		on:click={onPersonNodeClickAction}
		on:keydown|stopPropagation
		in:receive={{ key: sPersonId }}
		out:send={{ key: sPersonId }}
		bind:this={nodeDivRef}
	>
		<NodeActionsButton
			personId={sPersonId}
			relationshipId={sRelationshipId}
			{groupId}
			{name}
			{compatibleGroups}
		/>
		<div
			id="person-node-content-area"
			class="{personNodeContentAreaDynamicClass} person-node-content-area"
		>
			<Avatar />
			<NameLabel sInputValue={name} {bIsActivePerson} />
			{#if sPersonId !== $uiState.activePerson.id}
				<RelationshipLabel relationshipName={relationshipLabel} />
			{/if}
		</div>
		{#if bIsNodeInEditMode && $tempState.personIdsOffScreenFiltered.length > 0}
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
		width: 100%;
	}

	.person-node-name {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
