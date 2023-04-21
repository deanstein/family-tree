<script>
	import { css } from '@emotion/css';

	import familyTreeData from './stores/familyTreeData';
	import uiState from './stores/uiState';
	import relationshipMap, {
		grandparentsCompatibleGroups,
		greatAunclesCompatibleGroups,
		parentsCompatibleGroups,
		aunclesCompatibleGroups,
		siblingsCompatibleGroups,
		spouseCompatibleGroups,
		niblingsCompatibleGroups,
		childrenCompatibleGroups
	} from './stores/relationshipMap';
	import stylingConstants from './ui/stylingConstants';
	import { setActivePerson } from './logic/personManagement';

	import SaveStateBanner from './ui/SaveStateBanner.svelte';
	import ChooseTreeModal from './ui/ChooseTreeModal.svelte';
	import GenerationRow from './ui/NodeView/GenerationRow.svelte';
	import ScrollingRowFlank from './ui/NodeView/ScrollingRowFlank.svelte';
	import PersonNodeGroup from './ui/NodeView/PersonNodeGroup/PersonNodeGroup.svelte';
	import PersonNode from './ui/NodeView/PersonNode/PersonNode.svelte';
	import Footer from './ui/Footer.svelte';
	import DevTools from './ui/DevTools/DevTools.svelte';
	import PersonDetail from './ui/DetailView/PersonDetail.svelte';

	const sAppVersion = '0.7.4';
	const sDataVersion = relationshipMap.dataVersion;
	const bHideEmptyGroups = false;

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
</script>

<main>
	<div
		id="app-container"
		class="app-container {appContainerDynamicClass}"
		on:contextmenu={blockContextMenu}
	>
		<SaveStateBanner />
		<ChooseTreeModal />
		<PersonDetail />
		<div id="tree-canvas" class="tree-canvas">
			<div id="upper-generation-block" class="upper-generation-block">
				<GenerationRow rowHeight={stylingConstants.sizes.generationRowHeight}>
					<ScrollingRowFlank flank={'left'} slot="row-left-flank">
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
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
							bHideIfEmpty={bHideEmptyGroups}
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
							bHideIfEmpty={bHideEmptyGroups}
							personNodeGroupData={{
								groupId: relationshipMap.aunclesMaternal.id,
								groupName: relationshipMap.aunclesMaternal.label,
								groupMembers: $uiState.activePerson.relationships.aunclesMaternal,
								compatibleGroups: aunclesCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
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
							bHideIfEmpty={bHideEmptyGroups}
							personNodeGroupData={{
								groupId: relationshipMap.stepparentsPaternal.id,
								groupName: relationshipMap.stepparentsPaternal.label,
								groupMembers: $uiState.activePerson.relationships.stepparentsPaternal,
								compatibleGroups: parentsCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
							personNodeGroupData={{
								groupId: relationshipMap.aunclesPaternal.id,
								groupName: relationshipMap.aunclesPaternal.label,
								groupMembers: $uiState.activePerson.relationships.aunclesPaternal,
								compatibleGroups: aunclesCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
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

			<div id="siblings-generation-block" class="siblings-generation-block">
				<GenerationRow rowHeight={stylingConstants.sizes.generationRowHeight}>
					<ScrollingRowFlank flank={'left'} slot="row-left-flank">
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
							personNodeGroupData={{
								groupId: relationshipMap.siblingsInLaw.id,
								groupName: relationshipMap.siblingsInLaw.label,
								groupMembers: $uiState.activePerson.relationships.siblingsInLaw,
								compatibleGroups: siblingsCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
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
							bHideIfEmpty={bHideEmptyGroups}
							personNodeGroupData={{
								groupId: relationshipMap.spouses.id,
								groupName: relationshipMap.spouses.label,
								groupMembers: $uiState.activePerson.relationships.spouses,
								compatibleGroups: spouseCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
							personNodeGroupData={{
								groupId: relationshipMap.spouseStepsiblings.id,
								groupName: relationshipMap.spouseStepsiblings.label,
								groupMembers: $uiState.activePerson.relationships.spouseStepsiblings,
								compatibleGroups: siblingsCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
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

			<div id="lower-generation-block" class="lower-generation-block">
				<GenerationRow rowHeight={stylingConstants.sizes.generationRowHeight}>
					<ScrollingRowFlank flank={'left'} slot="row-left-flank">
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
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
							bHideIfEmpty={bHideEmptyGroups}
							personNodeGroupData={{
								groupId: relationshipMap.stepchildren.id,
								groupName: relationshipMap.stepchildren.label,
								groupMembers: $uiState.activePerson.relationships.stepchildren,
								compatibleGroups: childrenCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
							personNodeGroupData={{
								groupId: relationshipMap.childrenInLaw.id,
								groupName: relationshipMap.childrenInLaw.label,
								groupMembers: $uiState.activePerson.relationships.childrenInLaw,
								compatibleGroups: childrenCompatibleGroups
							}}
						/>
					</ScrollingRowFlank>
				</GenerationRow>
			</div>
		</div>
		<Footer {sAppVersion} {sDataVersion} />
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
	}

	.app-container {
		display: flex;
		flex-direction: column;
	}

	.tree-canvas {
		display: grid;
		height: 100vh;
		align-items: center;
		align-content: center;
		gap: 2vh;
	}

	.upper-generation-block {
		display: grid;
		gap: 2vh;
		width: 100vw;
	}

	.siblings-generation-block {
		display: grid;
		width: 100vw;
	}

	.lower-generation-block {
		display: grid;
		width: 100vw;
	}

	.active-person-container {
		margin-left: 5vh;
		margin-right: 5vh;
	}

	.middle-section {
		display: flex;
		gap: 2em;
		position: relative;
	}
</style>
