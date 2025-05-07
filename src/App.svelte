<script>
	import { css } from '@emotion/css';

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

	import familyTreeData from '$lib/stores/family-tree-data';
	import { bioEditAltName, nodeEditId, nodeEditRelationshipId } from '$lib/states/temp-state';
	import tempState from '$lib/stores/temp-state';
	import uiState from '$lib/stores/ui-state';

	import { setActivePerson } from '$lib/person-management';
	import { clearCanvas, resetCanvasSize, set2DContextScale } from '$lib/ui-management';
	import { appVersion, schemaVersion } from '$lib/versions';

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

	let doShowDevTools;
	let personNodeConnectionLineCanvasRef; // used for drawing connection lines between active person and ndoes
	let personNodeConnectionLineCanvasRefHover; // used for drawing a single connection line from the hovered node

	let shutdown = false;

	// set the initial active person as the first in the list
	if (Object.keys($uiState.activePerson).length == 0) {
		setActivePerson($familyTreeData.allPeople[0]);
	}

	// block the context menu everywhere
	let blockContextMenu = (event) => {
		event.preventDefault();
	};

	// on window resize, need to reset all canvases and redraw
	// connection lines
	window.addEventListener('resize', () => {
		resetCanvasSize(personNodeConnectionLineCanvasRef);
		resetCanvasSize(personNodeConnectionLineCanvasRefHover);
		redrawNodeConnectionLines($uiState.activePerson.id);
	});

	const toggleDevTools = () => {
		uiState.update((currentValue) => {
			currentValue.showDevTools = !currentValue.showDevTools;
			doShowDevTools = currentValue.showDevTools;
			return currentValue;
		});
	};

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

	// set up the primary canvas
	// used for drawing lines between every person node and the center of the screen
	// this is in a reactive block since it's wrapped by JDGAppContainer
	$: {
		if (personNodeConnectionLineCanvasRef) {
			$uiState.personNodeConnectionLineCanvas = personNodeConnectionLineCanvasRef;
			set2DContextScale(personNodeConnectionLineCanvasRef);
			// set up the hover canvas
			// used for drawing a hover line when hovering over a person node
			$uiState.personNodeConnectionLineCanvasHover = personNodeConnectionLineCanvasRefHover;
			set2DContextScale(personNodeConnectionLineCanvasRefHover);
		}
	}

	// update the drawn node connection lines as necessary
	$: {
		if (personNodeConnectionLineCanvasRef) {
			drawNodeConnectionLines(
				$uiState.personNodeConnectionLineCanvas,
				$uiState.personNodePositions,
				stylingConstants.sizes.nPersonNodeConnectionLineThickness,
				stylingConstants.colors.personNodeConnectionLineColor
			);
			clearCanvas(personNodeConnectionLineCanvasRefHover);
		}
	}
</script>

<main>
	{#if !shutdown}
		<JDGAppContainer showHeaderStripes={false}>
			<div
				id="app-container"
				class="app-container {appContainerCss}"
				on:contextmenu={blockContextMenu}
				role="main"
			>
				<ChooseTreeModal />
				{#if $tempState.mediaGalleryActiveId !== undefined}
					<MediaGalleryModal />
				{/if}
				{#if $nodeEditId !== undefined}
					<NodeActionsModal personId={$nodeEditId} relationshipId={$nodeEditRelationshipId} />
				{/if}
				<PersonDetailModal />
				{#if $bioEditAltName !== undefined}
					<EditAlternateNameModal />
				{/if}
				{#if $tempState.timelineEditEvent !== undefined}
					<EventDetailsModal />
				{/if}
				{#if $tempState.imageEditId !== undefined}
					<TimelineEventImageDetailModal />
				{/if}
				<Header />
				<div class="tree-content {treeContentCss}">
					<canvas class="tree-canvas" bind:this={personNodeConnectionLineCanvasRef} />
					<canvas class="tree-canvas" bind:this={personNodeConnectionLineCanvasRefHover} />
					<div class="generation-block {generationBlockCss}">
						<GenerationRow rowHeight={stylingConstants.sizes.generationRowHeight}>
							<ScrollingRowFlank flank={'left'} slot="row-left-flank">
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.greatAunclesMaternal.id,
										groupName: relationshipMap.greatAunclesMaternal.label,
										groupMembers: $uiState.activePerson.relationships.greatAunclesMaternal,
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
										groupMembers: $uiState.activePerson.relationships.grandparentsMaternal,
										compatibleGroups: grandparentsCompatibleGroups
									}}
									personNodeColor={generationRowColors[0]}
								/>
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.grandparentsPaternal.id,
										groupName: relationshipMap.grandparentsPaternal.label,
										groupMembers: $uiState.activePerson.relationships.grandparentsPaternal,
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
										groupMembers: $uiState.activePerson.relationships.greatAunclesPaternal,
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
										groupMembers: $uiState.activePerson.relationships.aunclesMaternal,
										compatibleGroups: aunclesCompatibleGroups
									}}
									personNodeColor={generationRowColors[1]}
								/>
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.stepparentsMaternal.id,
										groupName: relationshipMap.stepparentsMaternal.label,
										groupMembers: $uiState.activePerson.relationships.stepparentsMaternal,
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
									groupMembers: $uiState.activePerson.relationships.parents,
									compatibleGroups: parentsCompatibleGroups
								}}
								personNodeColor={generationRowColors[1]}
							/>
							<ScrollingRowFlank flank={'right'} slot="row-right-flank">
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.stepparentsPaternal.id,
										groupName: relationshipMap.stepparentsPaternal.label,
										groupMembers: $uiState.activePerson.relationships.stepparentsPaternal,
										compatibleGroups: parentsCompatibleGroups
									}}
									personNodeColor={generationRowColors[1]}
								/>
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.aunclesPaternal.id,
										groupName: relationshipMap.aunclesPaternal.label,
										groupMembers: $uiState.activePerson.relationships.aunclesPaternal,
										compatibleGroups: aunclesCompatibleGroups
									}}
									personNodeColor={generationRowColors[1]}
								/>
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.parentsInLaw.id,
										groupName: relationshipMap.parentsInLaw.label,
										groupMembers: $uiState.activePerson.relationships.parentsInLaw,
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
										groupMembers: $uiState.activePerson.relationships.siblingsInLaw,
										compatibleGroups: siblingsCompatibleGroups
									}}
									personNodeColor={generationRowColors[2]}
								/>
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.stepsiblings.id,
										groupName: relationshipMap.stepsiblings.label,
										groupMembers: $uiState.activePerson.relationships.stepsiblings,
										compatibleGroups: siblingsCompatibleGroups
									}}
									personNodeColor={generationRowColors[2]}
								/>
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.halfSiblingsMaternal.id,
										groupName: relationshipMap.halfSiblingsMaternal.label,
										groupMembers: $uiState.activePerson.relationships.halfSiblingsMaternal,
										compatibleGroups: siblingsCompatibleGroups
									}}
									personNodeColor={generationRowColors[2]}
								/>
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.siblings.id,
										groupName: relationshipMap.siblings.label,
										groupMembers: $uiState.activePerson.relationships.siblings,
										compatibleGroups: siblingsCompatibleGroups
									}}
									personNodeColor={generationRowColors[2]}
								/>
							</ScrollingRowFlank>

							<div slot="row-middle-section" class="active-person-container">
								<PersonNode
									personId={$uiState.activePerson.id}
									size={stylingConstants.sizes.personNodeActiveSize}
									context={contexts.treeView}
								/>
							</div>

							<ScrollingRowFlank flank={'right'} slot="row-right-flank">
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.halfSiblingsPaternal.id,
										groupName: relationshipMap.halfSiblingsPaternal.label,
										groupMembers: $uiState.activePerson.relationships.halfSiblingsPaternal,
										compatibleGroups: siblingsCompatibleGroups
									}}
									personNodeColor={generationRowColors[2]}
								/>
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.spouses.id,
										groupName: relationshipMap.spouses.label,
										groupMembers: $uiState.activePerson.relationships.spouses,
										compatibleGroups: spouseCompatibleGroups
									}}
									personNodeColor={generationRowColors[2]}
								/>
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.spouseSiblingsInLaw.id,
										groupName: relationshipMap.spouseSiblingsInLaw.label,
										groupMembers: $uiState.activePerson.relationships.spouseSiblingsInLaw,
										compatibleGroups: siblingsCompatibleGroups
									}}
									personNodeColor={generationRowColors[2]}
								/>
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.exSpouses.id,
										groupName: relationshipMap.exSpouses.label,
										groupMembers: $uiState.activePerson.relationships.exSpouses,
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
										groupMembers: $uiState.activePerson.relationships.niblings,
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
									groupMembers: $uiState.activePerson.relationships.children,
									compatibleGroups: childrenCompatibleGroups
								}}
								personNodeColor={generationRowColors[3]}
							/>
							<ScrollingRowFlank flank={'right'} slot="row-right-flank">
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.stepchildren.id,
										groupName: relationshipMap.stepchildren.label,
										groupMembers: $uiState.activePerson.relationships.stepchildren,
										compatibleGroups: childrenCompatibleGroups
									}}
									personNodeColor={generationRowColors[3]}
								/>
								<PersonNodeGroup
									personNodeGroupData={{
										groupId: relationshipMap.childrenInLaw.id,
										groupName: relationshipMap.childrenInLaw.label,
										groupMembers: $uiState.activePerson.relationships.childrenInLaw,
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
										groupMembers: $uiState.activePerson.relationships.grandniblings,
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
									groupMembers: $uiState.activePerson.relationships.grandchildren,
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
						onClickFunction={toggleDevTools}
						label={null}
						tooltip={doShowDevTools ? 'Hide Dev Tools' : 'Show Dev Tools'}
						isPrimary={false}
						paddingTopBottom="5px"
						paddingLeftRight="10px"
						faIcon={doShowDevTools ? 'fa-eye-slash' : 'fa-wrench'}
						fontSize={jdgSizes.fontSizeBodyXSm}
						doForceSquareRatio
					/>
				</JDGFooter>
				{#if $uiState.showDevTools}
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
