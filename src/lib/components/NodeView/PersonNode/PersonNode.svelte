<script>
	import { css } from '@emotion/css';
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import { get } from 'svelte/store';

	import contexts from '$lib/schemas/contexts';
	import timelineEventReference from '$lib/schemas/timeline-event-reference';

	import uiState from '$lib/stores/ui-state';
	import tempState from '$lib/stores/temp-state';
	import { isPersonNodeEditActive } from '$lib/states/temp-state';

	import {
		getPersonById,
		setActivePerson,
		addActivePersonToPeopleArray,
		getRelationshipNameById,
		addOrUpdateActivePersonInNewPersonGroup,
		removePersonFromPeopleArray,
		upgradePersonById,
		addTimelineEventReference
	} from '$lib/person-management';
	import {
		addOrUpdatePersonInActivePersonGroup,
		addOrUpdatePersonNodePosition as addOrUpdatePersonNodePosition,
		clearCanvas,
		getDivCentroid,
		removePersonFromActivePersonGroup,
		removePersonNodePosition,
		showPersonDetailView
	} from '$lib/ui-management';
	import {
		addAssociatedPersonToTimelineEvent,
		checkPersonForUnsavedChanges,
		hidePersonNodeActionsModal
	} from '$lib/temp-management';
	import { instantiateObject } from '$lib/utils';

	import { drawNodeConnectionLine, drawCrossfade } from '$lib/components/graphics-factory';
	import stylingConstants from '$lib/components/styling-constants';

	import BioPhoto from '$lib/components/BioPhoto.svelte';
	import NodeActionsButton from '$lib/components/NodeView/PersonNode/NodeActionsButton.svelte';

	addOrUpdatePersonNodePosition;
	const [send, receive] = drawCrossfade();

	export let personId;
	export let relationshipId = undefined;
	export let groupId = undefined;
	export let compatibleGroups = undefined;
	export let size = stylingConstants.sizes.personNodeSize;
	export let color = stylingConstants.colors.personNodeColor;
	// if not defined, will use the context to determine function
	export let onClickFunction = undefined;
	export let context = undefined;

	let name;
	let relationshipLabel;
	let isActivePerson;
	let nodeDivRef;
	let centroid;

	const onMouseEnter = () => {
		// on hover, draw a thicker connection line
		drawNodeConnectionLine(
			$uiState.personNodeConnectionLineCanvasHover.getContext('2d'),
			getDivCentroid(nodeDivRef),
			stylingConstants.sizes.nPersonNodeConnectionLineThicknessHover,
			stylingConstants.colors.hoverColorSubtleDark
		);
	};

	const onMouseLeave = () => {
		// on blur, clear the hover canvas entirely
		clearCanvas($uiState.personNodeConnectionLineCanvasHover);
	};

	//
	// these functions will be called onClick depending on the context
	//

	const showActivePersonOrTimeline = () => {
		// don't do anything on click if the node is in edit mode
		if ($tempState.nodeActionsModalPersonId === personId) {
			return;
		}

		// clicking on the active person will pull up the detailed view
		if (personId === $uiState.activePerson.id) {
			showPersonDetailView();
		} else {
			// clicking on anyone else makes them the active person
			setActivePerson(getPersonById(personId));
			addActivePersonToPeopleArray();
		}
	};

	// adds a relationship to the person being viewed in the person detail modal
	const addRelationshipToPerson = () => {
		addOrUpdatePersonInActivePersonGroup(personId, relationshipId);
		addOrUpdateActivePersonInNewPersonGroup(personId, $tempState.nodeEditGroupId);
		removePersonFromActivePersonGroup($tempState.nodeActionsModalPersonId, relationshipId);
		removePersonFromPeopleArray(getPersonById($tempState.nodeActionsModalPersonId));
		hidePersonNodeActionsModal();
		checkPersonForUnsavedChanges(personId);
	};

	const addAssociatedPersonToEvent = () => {
		// add the associated person to this timeline event
		addAssociatedPersonToTimelineEvent(personId);
		// add the event reference to the other person
		upgradePersonById(personId);
		const eventReference = instantiateObject(timelineEventReference);
		eventReference.personId = get(uiState).activePerson.id;
		eventReference.eventId = get(tempState).timelineEditEventId;
		addTimelineEventReference(personId, eventReference);
		// show the unsaved changes flag and stop editing
		checkPersonForUnsavedChanges(personId);
		isPersonNodeEditActive.set(false);
	};

	let personNodeCss = css`
		width: ${size};
		height: ${size};
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
		padding-bottom: ${relationshipId && context === contexts.treeView
			? '0px'
			: stylingConstants.sizes.padding};
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

	onMount(() => {
		// if no onClickFunction defined, choose one based on context
		if (!onClickFunction && context) {
			switch (context) {
				case contexts.treeView:
					onClickFunction = showActivePersonOrTimeline;
					break;
				case contexts.nodeActionsModal:
					onClickFunction = addRelationshipToPerson;
					break;
				case contexts.eventDetailsModal:
					onClickFunction = addAssociatedPersonToEvent;
					break;
				default:
					console.error('PersonNode: No function matching the given context.');
					break;
			}
		}
	});

	afterUpdate(() => {
		if (nodeDivRef && !isActivePerson) {
			centroid = getDivCentroid(nodeDivRef);
			// ensure this node's position is added or updated so we can draw a line from it
			addOrUpdatePersonNodePosition(personId, centroid);
		}
	});

	onDestroy(() => {
		// remove this node's position so no line is drawn to it
		removePersonNodePosition(personId);
	});

	$: {
		name = getPersonById(personId)?.name;
		if (relationshipId && compatibleGroups) {
			relationshipLabel = getRelationshipNameById(relationshipId, compatibleGroups);
		}

		// is this node the active person?
		if (personId === $uiState.activePerson.id) {
			isActivePerson = true;
		} else {
			isActivePerson = false;
		}
	}

	$: {
		addOrUpdatePersonNodePosition(personId, centroid);
	}

	$: {
		personNodeCss = css`
			${personNodeCss}
			z-index: ${$tempState.nodeActionsModalPersonId === personId
				? `${stylingConstants.zIndices.personNodeEditZIndex}`
				: 'auto'};
			background-color: ${isActivePerson ? stylingConstants.colors.activePersonNodeColor : color};
			border: ${$tempState.nodeActionsModalPersonId == personId
				? `2px solid ${stylingConstants.colors.hoverColor}`
				: '2px solid transparent'};
		`;
	}
</script>

{#key personId}
	<div
		class="person-node {personNodeCss}"
		role="button"
		tabindex="0"
		on:mouseenter={onMouseEnter}
		on:mouseleave={onMouseLeave}
		on:click={onClickFunction}
		on:keydown|stopPropagation
		in:receive={{ key: personId }}
		out:send={{ key: personId }}
		bind:this={nodeDivRef}
	>
		<!-- node actions is only valid in TreeView -->
		{#if context === contexts.treeView && personId !== $uiState.activePerson.id}
			<NodeActionsButton {personId} {relationshipId} {groupId} {name} {compatibleGroups} />
		{/if}
		<div class="person-node-content-area {personNodeContentAreaCss}">
			<BioPhoto {personId} allowEdit={false} />
			<div class="person-node-name-label-container {nameLabelContainerCss}">
				<div class="person-node-name-label {nameLabelCss}">
					{isActivePerson ? name.toUpperCase() : name}
				</div>
			</div>
			{#if personId !== $uiState.activePerson.id && relationshipId && context === contexts.treeView}
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
