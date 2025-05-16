<script>
	import { afterUpdate, onDestroy, onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { css } from '@emotion/css';

	import contexts from '$lib/schemas/contexts';
	import timelineEventReference from '$lib/schemas/timeline-event-reference';

	import { activePerson, hasUnsavedChanges } from '$lib/states/family-tree-state';
	import {
		isNodeEditActive,
		isTreeEditActive,
		nodeEditGroupId,
		nodeEditId,
		timelineEditEventId
	} from '$lib/states/temp-state';
	import {
		doShowPersonDetailView,
		personNodeConnectionLineCanvasRefHover
	} from '$lib/states/ui-state';

	import {
		getPersonById,
		setActivePerson,
		removePersonFromPeopleArray
	} from '$lib/tree-management';
	import {
		getRelationshipNameById,
		addOrUpdateActivePersonInNewPersonGroup,
		upgradePersonById,
		addTimelineEventReference
	} from '$lib/person-management';
	import {
		addOrUpdatePersonInActivePersonGroup,
		addOrUpdatePersonNodePosition,
		clearCanvas,
		getDivCentroid,
		removePersonFromActivePersonGroup,
		removePersonNodePosition
	} from '$lib/ui-management';
	import {
		addAssociatedPersonToTimelineEvent,
		hidePersonNodeActionsModal
	} from '$lib/temp-management';
	import { instantiateObject } from '$lib/utils';

	import { drawNodeConnectionLine, drawCrossfade } from '$lib/components/graphics-factory';
	import stylingConstants from '$lib/components/styling-constants';

	import BioPhoto from '$lib/components/BioPhoto.svelte';
	import NodeActionsButton from '$lib/components/NodeView/PersonNode/NodeActionsButton.svelte';

	const [send, receive] = drawCrossfade();

	export let personId;
	export let relationshipId = undefined;
	export let compatibleGroups = undefined;
	export let size = stylingConstants.sizes.personNodeSize;
	export let color = stylingConstants.colors.personNodeColor;
	// if not defined, will use the context to determine function
	export let onClickFunction = undefined;
	// function for the actions button in the corner
	export let onClickActionButton = undefined;
	export let context = undefined;
	export let actionButtonFaIcon = 'fa-ellipsis';
	export let actionButtonFaIconFontSize = '0.75rem';
	export let actionButtonPadding = '0.25rem';
	export let actionButtonIconColor = stylingConstants.colors.textColorLight;
	export let actionButtonBackgroundColor = 'transparent';
	export let actionButtonTooltip = '';

	let name;
	let relationshipLabel;
	let isActivePerson;
	let nodeDivRef;
	let centroid;

	const onMouseEnter = () => {
		// on hover, draw a thicker connection line
		drawNodeConnectionLine(
			$personNodeConnectionLineCanvasRefHover.getContext('2d'),
			getDivCentroid(nodeDivRef),
			stylingConstants.sizes.nPersonNodeConnectionLineThicknessHover,
			stylingConstants.colors.hoverColorSubtleDark
		);
	};

	const onMouseLeave = () => {
		// on blur, clear the hover canvas entirely
		clearCanvas($personNodeConnectionLineCanvasRefHover);
	};

	//
	// these functions will be called onClick depending on the context
	//

	// when clicked in the TreeView,
	// either makes that node the active person, or
	// if already the active person, shows the timeline for that person
	const showActivePersonOrTimeline = () => {
		// don't do anything on click if the node is in edit mode
		if ($nodeEditId === personId) {
			return;
		}
		// clicking on the active person will pull up the detailed view
		if (personId === $activePerson.id) {
			doShowPersonDetailView.set(true);
		} else {
			// clicking on anyone else makes them the active person
			setActivePerson(getPersonById(personId));
		}
	};

	// adds a relationship to the person being viewed in the person detail modal
	const addRelationshipToPerson = () => {
		addOrUpdatePersonInActivePersonGroup(personId, relationshipId);
		addOrUpdateActivePersonInNewPersonGroup(personId, get(nodeEditGroupId));
		removePersonFromActivePersonGroup(get(nodeEditId), relationshipId);
		removePersonFromPeopleArray(getPersonById(get(nodeEditId)));
		hidePersonNodeActionsModal();
		hasUnsavedChanges.set(true);
	};

	const addAssociatedPersonToEvent = () => {
		// add the associated person to this timeline event
		addAssociatedPersonToTimelineEvent(personId);
		// add the event reference to the other person
		upgradePersonById(personId);
		const eventReference = instantiateObject(timelineEventReference);
		eventReference.personId = get(activePerson).id;
		eventReference.eventId = get(timelineEditEventId);
		addTimelineEventReference(personId, eventReference);
		// show the unsaved changes flag and stop editing
		hasUnsavedChanges.set(true);
		isNodeEditActive.set(false);
	};

	const makeAssociatedPersonActive = () => {
		timelineEditEventId.set(undefined);
		timelineEditEventId.set(undefined);
		doShowPersonDetailView.set(false);
		setActivePerson(getPersonById(personId));
	};

	// gets dynamically modified later
	// first in onMount, then in a reactive block
	let personNodeCss = css`
		width: ${size};
		height: ${size};
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
				case contexts.associatedPersonSelect:
					onClickFunction = addAssociatedPersonToEvent;
					break;
				case contexts.associatedPerson:
					onClickFunction = makeAssociatedPersonActive;
					break;
				default:
					console.error('PersonNode: No function matching the given context.');
					break;
			}
		}

		// this part of the css has to be defined in onMount for some reason
		personNodeCss = css`
			${personNodeCss}
			cursor: ${onClickFunction ? 'pointer' : 'default'};
			:hover {
				border: ${onClickFunction
					? `2px solid ${stylingConstants.colors.hoverColorSubtleDark}`
					: ''};
				background-color: ${onClickFunction ? stylingConstants.colors.hoverColorSubtleDark : ''};
			}
		`;
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
		if (personId === $activePerson?.id) {
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
			z-index: ${$nodeEditId === personId
				? `${stylingConstants.zIndices.personNodeEditZIndex}`
				: 'auto'};
			background-color: ${isActivePerson ? stylingConstants.colors.activePersonNodeColor : color};
			border: ${$nodeEditId === personId
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
		<!-- show node actions button if edit mode is on -->
		<!-- and if an action button function is provided -->
		<!-- and if this is not the active person -->
		{#if $isTreeEditActive}
			{#if onClickActionButton && personId !== $activePerson.id}
				<NodeActionsButton
					onClickFunction={onClickActionButton}
					faIcon={actionButtonFaIcon}
					faIconFontSize={actionButtonFaIconFontSize}
					faIconPadding={actionButtonPadding}
					iconColor={actionButtonIconColor}
					backgroundColor={actionButtonBackgroundColor}
					tooltip={actionButtonTooltip}
				/>
			{/if}
		{/if}
		<div class="person-node-content-area {personNodeContentAreaCss}">
			<BioPhoto {personId} allowEdit={false} />
			<div class="person-node-name-label-container {nameLabelContainerCss}">
				<div class="person-node-name-label {nameLabelCss}">
					{isActivePerson ? name?.toUpperCase() : name}
				</div>
			</div>
			{#if personId !== $activePerson?.id && relationshipId && context === contexts.treeView}
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
