<script>
	import { css } from '@emotion/css';
	import { afterUpdate, onDestroy } from 'svelte';

	import uiState from '$lib/stores/ui-state';
	import tempState from '$lib/stores/temp-state';

	import {
		getPersonById,
		setActivePerson,
		addActivePersonToPeopleArray,
		getRelationshipNameById
	} from '$lib/person-management';
	import {
		addOrUpdatePersonNodePosition as addOrUpdatePersonNodePosition,
		clearCanvas,
		getDivCentroid,
		removePersonNodePosition,
		showPersonDetailView
	} from '$lib/ui-management';

	import { drawNodeConnectionLine, drawCrossfade } from '$lib/components/graphics-factory';
	import stylingConstants from '$lib/components/styling-constants';

	import BioPhoto from '$lib/components/BioPhoto.svelte';
	import NameLabel from '$lib/components/NodeView/PersonNode/NameLabel.svelte';
	import NodeActionsButton from '$lib/components/NodeView/PersonNode/NodeActionsButton.svelte';
	import RelationshipLabel from '$lib/components/NodeView/PersonNode/RelationshipLabel.svelte';

	addOrUpdatePersonNodePosition;
	const [send, receive] = drawCrossfade();

	export let sPersonId;
	export let sRelationshipId = undefined;
	export let groupId = undefined;
	export let bIsActivePerson = false;
	export let compatibleGroups = undefined;
	export let sNodeSize = stylingConstants.sizes.personNodeSize;
	export let nodeColor = stylingConstants.colors.personNodeColor;

	let personNodeCss;
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

		personNodeCss = css`
			width: ${sNodeSize};
			height: ${sNodeSize};
			z-index: ${$tempState.nodeActionsModalPersonId === sPersonId
				? `${stylingConstants.zIndices.personNodeEditZIndex}`
				: 'auto'};
			background-color: ${bIsActivePerson
				? stylingConstants.colors.activePersonNodeColor
				: nodeColor};
			border: ${$tempState.nodeActionsModalPersonId == sPersonId
				? `2px solid ${stylingConstants.colors.hoverColor}`
				: '2px solid transparent'};
			:hover {
				border: 2px solid ${stylingConstants.colors.hoverColorSubtleDark};
				background-color: ${stylingConstants.colors.hoverColorSubtleDark};
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

	const personNodeContentAreaCss = css`
		padding-top: ${stylingConstants.sizes.padding};
	`;

	const onPersonNodeMouseEnterAction = () => {
		// on hover, draw a thicker connection line
		drawNodeConnectionLine(
			$uiState.personNodeConnectionLineCanvasHover.getContext('2d'),
			getDivCentroid(nodeDivRef),
			stylingConstants.sizes.nPersonNodeConnectionLineThicknessHover,
			stylingConstants.colors.hoverColorSubtleDark
		);
	};

	const onPersonNodeMouseLeaveAction = () => {
		// on blur, clear the hover canvas entirely
		clearCanvas($uiState.personNodeConnectionLineCanvasHover);
	};

	const onPersonNodeClickAction = () => {
		// don't do anything on click if the node is in edit mode
		if ($tempState.nodeActionsModalPersonId === sPersonId) {
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
</script>

{#key sPersonId}
	<div
		class="person-node {personNodeCss}"
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
		<div class="person-node-content-area {personNodeContentAreaCss}">
			<BioPhoto personId={sPersonId} allowEdit={false} />
			<NameLabel sInputValue={name} {bIsActivePerson} />
			{#if sPersonId !== $uiState.activePerson.id}
				<RelationshipLabel relationshipName={relationshipLabel} />
			{/if}
		</div>
	</div>
{/key}

<style>
	.person-node {
		display: flex;
		position: relative;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		border-radius: 10px;
		cursor: pointer;
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
