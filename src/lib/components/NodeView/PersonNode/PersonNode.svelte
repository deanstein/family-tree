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
	import NodeActionsButton from '$lib/components/NodeView/PersonNode/NodeActionsButton.svelte';

	addOrUpdatePersonNodePosition;
	const [send, receive] = drawCrossfade();

	export let sPersonId;
	export let sRelationshipId = undefined;
	export let groupId = undefined;
	export let compatibleGroups = undefined;
	export let sNodeSize = stylingConstants.sizes.personNodeSize;
	export let nodeColor = stylingConstants.colors.personNodeColor;

	let name;
	let relationshipLabel;
	let isActivePerson;
	let nodeDivRef;
	let centroid;

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

	let personNodeCss = css`
		width: ${sNodeSize};
		height: ${sNodeSize};
		:hover {
			border: 2px solid ${stylingConstants.colors.hoverColorSubtleDark};
			background-color: ${stylingConstants.colors.hoverColorSubtleDark};
		}
	`;

	const personNodeContentAreaCss = css`
		padding-top: ${stylingConstants.sizes.padding};
	`;

	const nameLabelContainerCss = css`
		padding-top: ${stylingConstants.sizes.padding};
		padding-left: ${stylingConstants.sizes.padding};
		padding-right: ${stylingConstants.sizes.padding};
		padding-bottom: ${sRelationshipId ? '0px' : stylingConstants.sizes.padding};
	`;

	const nameLabelCss = css`
		font-size: ${stylingConstants.sizes.personNodeFontSize};
		border: 2px solid ${stylingConstants.colors.activeColor};
		color: white;
	`;

	const relationshipLabelContainerCss = css`
		margin-bottom: ${stylingConstants.sizes.padding};
		padding-left: ${stylingConstants.sizes.padding};
		padding-right: ${stylingConstants.sizes.padding};
	`;

	const relationshipLabelCss = css`
		color: ${stylingConstants.colors.textColor};
		border: 2px solid ${stylingConstants.colors.activeColor};
		font-size: ${stylingConstants.sizes.personNodeFontSize};
	`;

	afterUpdate(() => {
		if (nodeDivRef && !isActivePerson) {
			centroid = getDivCentroid(nodeDivRef);
			// ensure this node's position is added or updated so we can draw a line from it
			addOrUpdatePersonNodePosition(sPersonId, centroid);
		}
	});

	onDestroy(() => {
		// remove this node's position so no line is drawn to it
		removePersonNodePosition(sPersonId);
	});

	$: {
		name = getPersonById(sPersonId)?.name;
		relationshipLabel = getRelationshipNameById(sRelationshipId, compatibleGroups);

		// is this node the active person?
		if (sPersonId === $uiState.activePerson.id) {
			isActivePerson = true;
		} else {
			isActivePerson = false;
		}
	}

	$: {
		addOrUpdatePersonNodePosition(sPersonId, centroid);
	}

	$: {
		personNodeCss = css`
			${personNodeCss}
			z-index: ${$tempState.nodeActionsModalPersonId === sPersonId
				? `${stylingConstants.zIndices.personNodeEditZIndex}`
				: 'auto'};
			background-color: ${isActivePerson
				? stylingConstants.colors.activePersonNodeColor
				: nodeColor};
			border: ${$tempState.nodeActionsModalPersonId == sPersonId
				? `2px solid ${stylingConstants.colors.hoverColor}`
				: '2px solid transparent'};
		`;
	}
</script>

{#key sPersonId}
	<div
		class="person-node {personNodeCss}"
		role="button"
		tabindex="0"
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
			<div class="person-node-name-label-container {nameLabelContainerCss}">
				<div class="person-node-name-label {nameLabelCss}">
					{isActivePerson ? name.toUpperCase() : name}
				</div>
			</div>
			{#if sPersonId !== $uiState.activePerson.id && sRelationshipId}
				<div class="person-node-relationship-label-container {relationshipLabelContainerCss}">
					<div class="person-node-relationship-label {relationshipLabelCss}">
						{relationshipLabel}
					</div>
				</div>
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

	.person-node-name-label-container {
		display: flex;
		width: -moz-available;
		width: -webkit-fill-available;
	}

	.person-node-name-label {
		color: white;
		width: 100%;
		text-align: center;
		font-weight: bold;
		outline: none;
		border: 2px solid transparent;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: -webkit-fill-available;
		width: -moz-available;
	}

	.person-node-relationship-label-container {
		width: -webkit-fill-available;
		width: -moz-available;
	}

	.person-node-relationship-label {
		font-style: italic;
		outline: none;
		-webkit-appearance: none;
		-moz-appearance: none;
		text-align: center;
		appearance: none;
		border: 2px solid transparent;
		font-style: italic;
		background-color: rgb(241, 241, 241);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: -webkit-fill-available;
		width: -moz-available;
		border-radius: 5px;
	}
</style>
