<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';

	import familyTreeData from './stores/family-tree-data';
	import tempState from './stores/temp-state';
	import uiState from './stores/ui-state';
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
	} from './schemas/relationship-map';
	import stylingConstants from './ui/styling-constants';
	import { setActivePerson } from './logic/person-management';
	import { set2DContextScale } from './logic/ui-management';
	import { appVersion, schemaVersion } from './versions';
	import { drawAllNodeConnectionLines } from './ui/graphics-factory';

	import SaveStateBanner from './ui/Notifications/SaveStateBanner.svelte';
	import ChooseTreeModal from './ui/StartingModal/ChooseTreeModal.svelte';
	import Header from './ui/Header.svelte';
	import GenerationRow from './ui/NodeView/GenerationRow/GenerationRow.svelte';
	import ScrollingRowFlank from './ui/NodeView/GenerationRow/ScrollingRowFlank.svelte';
	import PersonNodeGroup from './ui/NodeView/PersonNodeGroup/PersonNodeGroup.svelte';
	import PersonNode from './ui/NodeView/PersonNode/PersonNode.svelte';
	import PersonDetailModal from './ui/PersonDetailModal/PersonDetailModal.svelte';
	import NodeActionsModal from './ui/NodeView/PersonNode/NodeActionsModal.svelte';
	import Footer from './ui/Footer.svelte';
	import DevTools from './ui/DevTools/DevTools.svelte';
	import EditAlternateNameModal from './ui/PersonDetailModal/Bio/EditAlternateNameModal.svelte';
	import EditTimelineEventModal from './ui/PersonDetailModal/Timeline/EditTimelineEventModal.svelte';

	let personNodeConnectionLineCanvasRef; // used for drawing connection lines between active person and ndoes
	let personNodeConnectionLineCanvasRefHover; // used for drawing a single connection line from the hovered node

	// set the initial active person as the first in the list
	if (Object.keys($uiState.activePerson).length == 0) {
		setActivePerson($familyTreeData.allPeople[0]);
	}

	let blockContextMenu = (event) => {
		event.preventDefault();
	};

	const appContainerDynamicClass = css`
		a {
		color: ${stylingConstants.colors.hyperlinkColor};
		}
	}
	`;

	const treeContentDynamicClass = css`
		height: ${100 - stylingConstants.sizes.nHeaderHeight + 'vh'};
		gap: ${stylingConstants.sizes.generationRowGap};
	`;

	const generationBlockDynamicClass = css`
		gap: ${stylingConstants.sizes.generationRowGap};
	`;

	$: {
		if (personNodeConnectionLineCanvasRef) {
			drawAllNodeConnectionLines($uiState.personNodePositions);
		}
	}

	onMount(() => {
		// set up the primary canvas
		const primary2dContext = personNodeConnectionLineCanvasRef.getContext('2d');
		$uiState.personNodeConnectionLineCanvas = personNodeConnectionLineCanvasRef;
		$uiState.personNodeConnectionLineContext2d = primary2dContext;
		// set up the hover canvas
		// used to draw a hover line when hovering over a person node
		const hover2dContext = personNodeConnectionLineCanvasRefHover.getContext('2d');
		set2DContextScale(personNodeConnectionLineCanvasRefHover, hover2dContext);
		// write the hover canvas to the state
		$uiState.personNodeConnectionLineCanvasHover = personNodeConnectionLineCanvasRefHover;
		$uiState.personNodeConnectionLineContext2dHover = hover2dContext;
	});
</script>

<main>
	<div
		id="app-container"
		class="app-container {appContainerDynamicClass}"
		on:contextmenu={blockContextMenu}
	>
		{#if $uiState.personIdForNodeEdit === undefined}
			<SaveStateBanner />
		{/if}
		<ChooseTreeModal />
		{#if $tempState.nodeActionsModalPersonId !== undefined}
			<NodeActionsModal
				personId={$tempState.nodeActionsModalPersonId}
				relationshipId={$tempState.nodeEditRelationshipId}
			/>
		{/if}
		<PersonDetailModal />
		{#if $tempState.bioEditAltName !== undefined}
			<EditAlternateNameModal />
		{/if}
		{#if $tempState.timelineEditEvent !== undefined}
			<EditTimelineEventModal />
		{/if}
		<Header />
		<div id="tree-content" class="{treeContentDynamicClass} tree-content">
			<canvas id="tree-canvas" class="tree-canvas" bind:this={personNodeConnectionLineCanvasRef} />
			<canvas id="hover-canvas" class="tree-canvas" bind:this={personNodeConnectionLineCanvasRefHover} />
			<div id="upper-generation-block" class="{generationBlockDynamicClass} generation-block">
				<GenerationRow rowHeight={stylingConstants.sizes.generationRowHeight}>
					<ScrollingRowFlank flank={'left'} slot="row-left-flank">
						<PersonNodeGroup
							personNodeGroupData={{
								groupId: relationshipMap.greatAunclesMaternal.id,
								groupName: relationshipMap.greatAunclesMaternal.label,
								groupMembers: $uiState.activePerson.relationships.greatAunclesMaternal,
								compatibleGroups: greatAunclesCompatibleGroups
							}}
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
						/>
						<PersonNodeGroup
							personNodeGroupData={{
								groupId: relationshipMap.grandparentsPaternal.id,
								groupName: relationshipMap.grandparentsPaternal.label,
								groupMembers: $uiState.activePerson.relationships.grandparentsPaternal,
								compatibleGroups: grandparentsCompatibleGroups
							}}
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
						/>
						<PersonNodeGroup
							personNodeGroupData={{
								groupId: relationshipMap.stepparentsMaternal.id,
								groupName: relationshipMap.stepparentsMaternal.label,
								groupMembers: $uiState.activePerson.relationships.stepparentsMaternal,
								compatibleGroups: parentsCompatibleGroups
							}}
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
					/>
					<ScrollingRowFlank flank={'right'} slot="row-right-flank">
						<PersonNodeGroup
							personNodeGroupData={{
								groupId: relationshipMap.stepparentsPaternal.id,
								groupName: relationshipMap.stepparentsPaternal.label,
								groupMembers: $uiState.activePerson.relationships.stepparentsPaternal,
								compatibleGroups: parentsCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							personNodeGroupData={{
								groupId: relationshipMap.aunclesPaternal.id,
								groupName: relationshipMap.aunclesPaternal.label,
								groupMembers: $uiState.activePerson.relationships.aunclesPaternal,
								compatibleGroups: aunclesCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							personNodeGroupData={{
								groupId: relationshipMap.parentsInLaw.id,
								groupName: relationshipMap.parentsInLaw.label,
								groupMembers: $uiState.activePerson.relationships.parentsInLaw,
								compatibleGroups: parentsCompatibleGroups
							}}
						/>
					</ScrollingRowFlank>
				</GenerationRow>
			</div>

			<div id="siblings-generation-block" class="{generationBlockDynamicClass} generation-block">
				<GenerationRow rowHeight={stylingConstants.sizes.generationRowHeight}>
					<ScrollingRowFlank flank={'left'} slot="row-left-flank">
						<PersonNodeGroup
							personNodeGroupData={{
								groupId: relationshipMap.siblingsInLaw.id,
								groupName: relationshipMap.siblingsInLaw.label,
								groupMembers: $uiState.activePerson.relationships.siblingsInLaw,
								compatibleGroups: siblingsCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							personNodeGroupData={{
								groupId: relationshipMap.stepsiblings.id,
								groupName: relationshipMap.stepsiblings.label,
								groupMembers: $uiState.activePerson.relationships.stepsiblings,
								compatibleGroups: siblingsCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							personNodeGroupData={{
								groupId: relationshipMap.halfSiblingsMaternal.id,
								groupName: relationshipMap.halfSiblingsMaternal.label,
								groupMembers: $uiState.activePerson.relationships.halfSiblingsMaternal,
								compatibleGroups: siblingsCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							personNodeGroupData={{
								groupId: relationshipMap.siblings.id,
								groupName: relationshipMap.siblings.label,
								groupMembers: $uiState.activePerson.relationships.siblings,
								compatibleGroups: siblingsCompatibleGroups
							}}
						/>
					</ScrollingRowFlank>

					<div
						slot="row-middle-section"
						id="active-person-container"
						class="active-person-container"
					>
						<PersonNode
							sPersonId={$uiState.activePerson.id}
							sNodeSize={stylingConstants.sizes.personNodeActiveSize}
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
						/>
						<PersonNodeGroup
							personNodeGroupData={{
								groupId: relationshipMap.spouses.id,
								groupName: relationshipMap.spouses.label,
								groupMembers: $uiState.activePerson.relationships.spouses,
								compatibleGroups: spouseCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							personNodeGroupData={{
								groupId: relationshipMap.spouseSiblingsInLaw.id,
								groupName: relationshipMap.spouseSiblingsInLaw.label,
								groupMembers: $uiState.activePerson.relationships.spouseSiblingsInLaw,
								compatibleGroups: siblingsCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							personNodeGroupData={{
								groupId: relationshipMap.exSpouses.id,
								groupName: relationshipMap.exSpouses.label,
								groupMembers: $uiState.activePerson.relationships.exSpouses,
								compatibleGroups: spouseCompatibleGroups
							}}
						/>
					</ScrollingRowFlank>
				</GenerationRow>
			</div>

			<div id="lower-generation-block" class="{generationBlockDynamicClass} generation-block">
				<GenerationRow rowHeight={stylingConstants.sizes.generationRowHeight}>
					<ScrollingRowFlank flank={'left'} slot="row-left-flank">
						<PersonNodeGroup
							personNodeGroupData={{
								groupId: relationshipMap.niblings.id,
								groupName: relationshipMap.niblings.label,
								groupMembers: $uiState.activePerson.relationships.niblings,
								compatibleGroups: niblingsCompatibleGroups
							}}
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
					/>
					<ScrollingRowFlank flank={'right'} slot="row-right-flank">
						<PersonNodeGroup
							personNodeGroupData={{
								groupId: relationshipMap.stepchildren.id,
								groupName: relationshipMap.stepchildren.label,
								groupMembers: $uiState.activePerson.relationships.stepchildren,
								compatibleGroups: childrenCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							personNodeGroupData={{
								groupId: relationshipMap.childrenInLaw.id,
								groupName: relationshipMap.childrenInLaw.label,
								groupMembers: $uiState.activePerson.relationships.childrenInLaw,
								compatibleGroups: childrenCompatibleGroups
							}}
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
					/>

					<ScrollingRowFlank flank={'right'} slot="row-right-flank" />
				</GenerationRow>
			</div>
		</div>
		<Footer {appVersion} {schemaVersion} />
		{#if $uiState.showDevTools}
			<DevTools />
		{/if}
	</div>
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
		max-width: 100vw;
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
