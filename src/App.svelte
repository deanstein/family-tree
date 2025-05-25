<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';

	import { person } from '$lib/schemas/person';
	import contexts from '$lib/schemas/contexts';
	import relationshipMap, {
		grandparentsCompatibleGroups,
		greatAunclesCompatibleGroups,
		parentsCompatibleGroups,
		aunclesCompatibleGroups,
		siblingsCompatibleGroups,
		spouseCompatibleGroups,
		niblingsCompatibleGroups,
		childrenCompatibleGroups,
		grandchildrenCompatibleGroups
	} from '$lib/schemas/relationship-map';

	import { activeFamilyTreeData } from '$lib/states/family-tree-state';
	import { activePerson } from '$lib/states/family-tree-state';
	import {
		isTreeEditActive,
		nodeEditId,
		nodeEditRelationshipId,
		timelineEditEvent
	} from '$lib/states/temp-state';
	import {
		personNodeConnectionLineCanvasRef,
		personNodeConnectionLineCanvasRefHover,
		personNodePositions,
		showChooseTreeModal,
		showEditAlternateNameModal,
		showNodeActionsModal,
		showMediaGalleryModal,
		showTimelineEventDetailsModal,
		showTimelineEventImageDetailModal,
		showDevTools
	} from '$lib/states/ui-state';

	import { addOrUpdatePersonInPeopleArray, setActivePerson } from '$lib/tree-management';
	import { clearCanvas, resetCanvasSize, set2DContextScale } from '$lib/ui-management';
	import { appVersion, schemaVersion } from '$lib/versions';
	import { instantiateObject } from '$lib/utils';

	// @ts-expect-error
	import { familyTreeRepoName } from 'jdg-ui-svelte/jdg-persistence-management.js';
	// @ts-expect-error
	import { jdgSizes } from 'jdg-ui-svelte/jdg-shared-styles.js';

	import { JDGAppContainer, JDGButton, JDGFooter } from 'jdg-ui-svelte';
	import ChooseTreeModal from '$lib/components/Modals/ChooseTreeModal.svelte';
	import DevTools from '$lib/components/DevTools/DevTools.svelte';
	import EditAlternateNameModal from '$lib/components/Modals/EditAlternateNameModal.svelte';
	import EventDetailsModal from '$lib/components/Timeline/EventDetails/EventDetailsModal.svelte';
	import GenerationRow from '$lib/components/NodeView/GenerationRow/GenerationRow.svelte';
	import Header from '$lib/components/Header.svelte';
	import NodeActionsModal from '$lib/components/Modals/NodeActionsModal.svelte';
	import PersonDetailModal from '$lib/components/Modals/PersonDetailModal.svelte';
	import PersonNode from '$lib/components/NodeView/PersonNode/PersonNode.svelte';
	import PersonNodeGroup from '$lib/components/NodeView/PersonNode/PersonNodeGroup.svelte';
	import ScrollingRowFlank from '$lib/components/NodeView/GenerationRow/ScrollingRowFlank.svelte';
	import TimelineEventImageDetailModal from '$lib/components/Timeline/TimelineEventImageDetailModal.svelte';
	import MediaGalleryModal from '$lib/components/MediaGalleryModal.svelte';

	import {
		drawNodeConnectionLines,
		generateGradient,
		redrawNodeConnectionLines
	} from '$lib/components/graphics-factory';
	import stylingConstants from '$lib/components/styling-constants';

	let lineCanvasRef; // used for drawing connection lines between active person and ndoes
	let lineCanvasRefHover; // used for drawing a single connection line from the hovered node

	let shutdown = true;

	// if there's no known people in this tree, it's a new tree
	// so add a default person and enable editing mode
	if ($activeFamilyTreeData.allPeople.length === 0) {
		activeFamilyTreeData.update((currentValue) => {
			currentValue.allPeople.push(instantiateObject(person));
			return currentValue;
		});
		// showing tree edit active makes the background more interesting
		isTreeEditActive.set(true);
	}

	// set the initial active person as the first in the list
	setActivePerson($activeFamilyTreeData.allPeople[0]);

	// block the context menu everywhere
	let blockContextMenu = (event) => {
		event.preventDefault();
	};

	// on window resize, need to reset all canvases and redraw
	// connection lines
	window.addEventListener('resize', () => {
		resetCanvasSize(personNodeConnectionLineCanvasRef);
		resetCanvasSize(lineCanvasRefHover);
		redrawNodeConnectionLines($activePerson.id);
	});

	const appContainerCss = css`
		a {
		color: ${stylingConstants.colors.hyperlinkColor};
		}
	}
	`;

	const treeContentCss = css`
		height: ${100 - stylingConstants.sizes.nHeaderHeight + 'vh'};
		gap: ${stylingConstants.sizes.generationRowGap};
	`;

	const generationBlockCss = css`
		gap: ${stylingConstants.sizes.generationRowGap};
	`;

	const generationRowColors = generateGradient(
		5,
		stylingConstants.colors.personNodeGradient1,
		stylingConstants.colors.personNodeGradient2,
		stylingConstants.colors.personNodeGradient3
	);

	onMount(() => {
		// initially show the choose tree modal
		showChooseTreeModal.set(true);
	});

	// always keep the activePerson updated in the activeFamilyTreeData
	$: {
		addOrUpdatePersonInPeopleArray($activePerson);
	}

	// set up the primary canvas
	// used for drawing lines between every person node and the center of the screen
	// this is in a reactive block since it's wrapped by JDGAppContainer
	$: {
		if (lineCanvasRef && lineCanvasRefHover) {
			personNodeConnectionLineCanvasRef.set(lineCanvasRef);
			set2DContextScale(lineCanvasRef);
			// set up the hover canvas
			// used for drawing a hover line when hovering over a person node
			personNodeConnectionLineCanvasRefHover.set(lineCanvasRefHover);
			set2DContextScale(lineCanvasRefHover);
		}
	}

	// update the drawn node connection lines as necessary
	$: {
		if (lineCanvasRef) {
			drawNodeConnectionLines(
				$personNodeConnectionLineCanvasRef,
				$personNodePositions,
				stylingConstants.sizes.nPersonNodeConnectionLineThickness,
				stylingConstants.colors.personNodeConnectionLineColor
			);
			clearCanvas(lineCanvasRefHover);
		}
	}
</script>

<main>
	{#if !shutdown}
		<JDGAppContainer
			showHeaderStripes={false}
			appLoadingIconSrc="./static/img/family-tree-icon.png"
		>
			<div
				id="app-container"
				class="app-container {appContainerCss}"
				on:contextmenu={blockContextMenu}
				role="main"
			>
				<!-- MODALS -->
				{#if $showChooseTreeModal}
					<ChooseTreeModal />
				{/if}
				{#if $showNodeActionsModal}
					<NodeActionsModal personId={$nodeEditId} relationshipId={$nodeEditRelationshipId} />
				{/if}
				<PersonDetailModal />
				{#if $showEditAlternateNameModal}
					<EditAlternateNameModal />
				{/if}
				{#if showTimelineEventDetailsModal}
					<EventDetailsModal />
				{/if}
				{#if $showMediaGalleryModal}
					<MediaGalleryModal />
				{/if}
				{#if $showTimelineEventImageDetailModal}
					<TimelineEventImageDetailModal />
				{/if}
				<!-- MAIN APP -->
				<Header />
				<div class="tree-content {treeContentCss}">
					<canvas class="tree-canvas" bind:this={lineCanvasRef} />
					<canvas class="tree-canvas" bind:this={lineCanvasRefHover} />
					<div class="generation-block {generationBlockCss}">
						<GenerationRow rowHeight={stylingConstants.sizes.generationRowHeight}>
							<ScrollingRowFlank flank={'left'} slot="row-left-flank">
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.greatAunclesMaternal.id,
										groupName: relationshipMap.greatAunclesMaternal.label,
										groupMembers: $activePerson?.relationships?.greatAunclesMaternal,
										compatibleGroups: greatAunclesCompatibleGroups
									}}
									personNodeColor={generationRowColors[0]}
								/>
							</ScrollingRowFlank>

							<div slot="row-middle-section" class="middle-section">
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.grandparentsMaternal.id,
										groupName: relationshipMap.grandparentsMaternal.label,
										groupMembers: $activePerson?.relationships?.grandparentsMaternal,
										compatibleGroups: grandparentsCompatibleGroups
									}}
									personNodeColor={generationRowColors[0]}
								/>
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.grandparentsPaternal.id,
										groupName: relationshipMap.grandparentsPaternal.label,
										groupMembers: $activePerson?.relationships?.grandparentsPaternal,
										compatibleGroups: grandparentsCompatibleGroups
									}}
									personNodeColor={generationRowColors[0]}
								/>
							</div>

							<ScrollingRowFlank flank={'right'} slot="row-right-flank">
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.greatAunclesPaternal.id,
										groupName: relationshipMap.greatAunclesPaternal.label,
										groupMembers: $activePerson?.relationships?.greatAunclesPaternal,
										compatibleGroups: greatAunclesCompatibleGroups
									}}
									personNodeColor={generationRowColors[0]}
								/>
							</ScrollingRowFlank>
						</GenerationRow>
						<GenerationRow rowHeight={stylingConstants.sizes.generationRowHeight}>
							<ScrollingRowFlank flank={'left'} slot="row-left-flank">
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.aunclesMaternal.id,
										groupName: relationshipMap.aunclesMaternal.label,
										groupMembers: $activePerson?.relationships?.aunclesMaternal,
										compatibleGroups: aunclesCompatibleGroups
									}}
									personNodeColor={generationRowColors[1]}
								/>
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.stepparentsMaternal.id,
										groupName: relationshipMap.stepparentsMaternal.label,
										groupMembers: $activePerson?.relationships?.stepparentsMaternal,
										compatibleGroups: parentsCompatibleGroups
									}}
									personNodeColor={generationRowColors[1]}
								/>
							</ScrollingRowFlank>
							<PersonNodeGroup
								slot="row-middle-section"
								personNodeGroupData={{
									groupId: relationshipMap.parents.id,
									groupName: relationshipMap.parents.label,
									groupMembers: $activePerson?.relationships?.parents,
									compatibleGroups: parentsCompatibleGroups
								}}
								personNodeColor={generationRowColors[1]}
							/>
							<ScrollingRowFlank flank={'right'} slot="row-right-flank">
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.stepparentsPaternal.id,
										groupName: relationshipMap.stepparentsPaternal.label,
										groupMembers: $activePerson?.relationships?.stepparentsPaternal,
										compatibleGroups: parentsCompatibleGroups
									}}
									personNodeColor={generationRowColors[1]}
								/>
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.aunclesPaternal.id,
										groupName: relationshipMap.aunclesPaternal.label,
										groupMembers: $activePerson?.relationships?.aunclesPaternal,
										compatibleGroups: aunclesCompatibleGroups
									}}
									personNodeColor={generationRowColors[1]}
								/>
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.parentsInLaw.id,
										groupName: relationshipMap.parentsInLaw.label,
										groupMembers: $activePerson?.relationships?.parentsInLaw,
										compatibleGroups: parentsCompatibleGroups
									}}
									personNodeColor={generationRowColors[1]}
								/>
							</ScrollingRowFlank>
						</GenerationRow>
					</div>

					<div class="generation-block {generationBlockCss}">
						<GenerationRow rowHeight={stylingConstants.sizes.generationRowHeight}>
							<ScrollingRowFlank flank={'left'} slot="row-left-flank">
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.siblingsInLaw.id,
										groupName: relationshipMap.siblingsInLaw.label,
										groupMembers: $activePerson?.relationships?.siblingsInLaw,
										compatibleGroups: siblingsCompatibleGroups
									}}
									personNodeColor={generationRowColors[2]}
								/>
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.stepsiblings.id,
										groupName: relationshipMap.stepsiblings.label,
										groupMembers: $activePerson?.relationships?.stepsiblings,
										compatibleGroups: siblingsCompatibleGroups
									}}
									personNodeColor={generationRowColors[2]}
								/>
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.halfSiblingsMaternal.id,
										groupName: relationshipMap.halfSiblingsMaternal.label,
										groupMembers: $activePerson?.relationships?.halfSiblingsMaternal,
										compatibleGroups: siblingsCompatibleGroups
									}}
									personNodeColor={generationRowColors[2]}
								/>
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.siblings.id,
										groupName: relationshipMap.siblings.label,
										groupMembers: $activePerson?.relationships?.siblings,
										compatibleGroups: siblingsCompatibleGroups
									}}
									personNodeColor={generationRowColors[2]}
								/>
							</ScrollingRowFlank>

							<div slot="row-middle-section" class="active-person-container">
								<PersonNode
									personId={$activePerson?.id}
									size={stylingConstants.sizes.personNodeActiveSize}
									context={contexts.treeView}
								/>
							</div>

							<ScrollingRowFlank flank={'right'} slot="row-right-flank">
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.halfSiblingsPaternal.id,
										groupName: relationshipMap.halfSiblingsPaternal.label,
										groupMembers: $activePerson?.relationships?.halfSiblingsPaternal,
										compatibleGroups: siblingsCompatibleGroups
									}}
									personNodeColor={generationRowColors[2]}
								/>
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.spouses.id,
										groupName: relationshipMap.spouses.label,
										groupMembers: $activePerson?.relationships?.spouses,
										compatibleGroups: spouseCompatibleGroups
									}}
									personNodeColor={generationRowColors[2]}
								/>
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.spouseSiblingsInLaw.id,
										groupName: relationshipMap.spouseSiblingsInLaw.label,
										groupMembers: $activePerson?.relationships?.spouseSiblingsInLaw,
										compatibleGroups: siblingsCompatibleGroups
									}}
									personNodeColor={generationRowColors[2]}
								/>
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.exSpouses.id,
										groupName: relationshipMap.exSpouses.label,
										groupMembers: $activePerson?.relationships?.exSpouses,
										compatibleGroups: spouseCompatibleGroups
									}}
									personNodeColor={generationRowColors[2]}
								/>
							</ScrollingRowFlank>
						</GenerationRow>
					</div>

					<div class="generation-block {generationBlockCss}">
						<GenerationRow rowHeight={stylingConstants.sizes.generationRowHeight}>
							<ScrollingRowFlank flank={'left'} slot="row-left-flank">
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.niblings.id,
										groupName: relationshipMap.niblings.label,
										groupMembers: $activePerson?.relationships?.niblings,
										compatibleGroups: niblingsCompatibleGroups
									}}
									personNodeColor={generationRowColors[3]}
								/>
							</ScrollingRowFlank>
							<PersonNodeGroup
								slot="row-middle-section"
								personNodeGroupData={{
									groupId: relationshipMap.children.id,
									groupName: relationshipMap.children.label,
									groupMembers: $activePerson?.relationships?.children,
									compatibleGroups: childrenCompatibleGroups
								}}
								personNodeColor={generationRowColors[3]}
							/>
							<ScrollingRowFlank flank={'right'} slot="row-right-flank">
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.stepchildren.id,
										groupName: relationshipMap.stepchildren.label,
										groupMembers: $activePerson?.relationships?.stepchildren,
										compatibleGroups: childrenCompatibleGroups
									}}
									personNodeColor={generationRowColors[3]}
								/>
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.childrenInLaw.id,
										groupName: relationshipMap.childrenInLaw.label,
										groupMembers: $activePerson?.relationships?.childrenInLaw,
										compatibleGroups: childrenCompatibleGroups
									}}
									personNodeColor={generationRowColors[3]}
								/>
							</ScrollingRowFlank>
						</GenerationRow>
						<GenerationRow rowHeight={stylingConstants.sizes.generationRowHeight}>
							<ScrollingRowFlank flank={'left'} slot="row-left-flank">
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.grandniblings.id,
										groupName: relationshipMap.grandniblings.label,
										groupMembers: $activePerson?.relationships?.grandniblings,
										compatibleGroups: grandchildrenCompatibleGroups
									}}
									personNodeColor={generationRowColors[4]}
								/>
							</ScrollingRowFlank>

							<PersonNodeGroup
								slot="row-middle-section"
								personNodeGroupData={{
									groupId: relationshipMap.grandchildren.id,
									groupName: relationshipMap.grandchildren.label,
									groupMembers: $activePerson?.relationships?.grandchildren,
									compatibleGroups: grandchildrenCompatibleGroups
								}}
								personNodeColor={generationRowColors[4]}
							/>

							<ScrollingRowFlank flank={'right'} slot="row-right-flank" />
						</GenerationRow>
					</div>
				</div>
				<JDGFooter
					repoName={familyTreeRepoName}
					copyrightHref="https://jdeangoldstein.com"
					{appVersion}
					webAppVersionLabel="App"
					additionalVersionData={'Schema: v' + schemaVersion}
					alignItems="center"
				>
					<JDGButton
						onClickFunction={() => showDevTools.update((value) => !value)}
						label={null}
						tooltip={$showDevTools ? 'Hide Dev Tools' : 'Show Dev Tools'}
						isPrimary={false}
						paddingTopBottom="5px"
						paddingLeftRight="10px"
						faIcon={$showDevTools ? 'fa-eye-slash' : 'fa-wrench'}
						fontSize={jdgSizes.fontSizeBodyXSm}
						doForceSquareRatio
					/>
				</JDGFooter>
				{#if $showDevTools}
					<DevTools />
				{/if}
			</div>
		</JDGAppContainer>
	{/if}
</main>

<style>
	:root {
		font-family: proxima-nova, sans-serif;

		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	:global(body) {
		margin: 0;
		overflow-x: hidden;
	}

	.app-container {
		display: flex;
		flex-direction: column;
	}

	.tree-content {
		display: grid;
		align-items: center;
		align-content: center;
	}

	/* used for drawing connection lines between person nodes */
	.tree-canvas {
		position: absolute;
		width: 100vw; /* necessary to make the lines align with the nodes */
		z-index: -1;
	}

	.generation-block {
		display: grid;
	}

	.middle-section {
		display: flex;
		gap: 1vw;
	}
</style>
