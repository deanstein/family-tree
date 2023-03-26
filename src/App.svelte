<script>
	import familyTreeData from './stores/familyTreeData';
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
	import stylingConstants from './stores/stylingConstants';

	import { setActivePerson } from './logic/personManagement';

	import GenerationRow from './ui/NodeView/GenerationRow.svelte';
	import PersonNodeGroup from './ui/NodeView/PersonNodeGroup/PersonNodeGroup.svelte';
	import PersonNode from './ui/NodeView/PersonNode/PersonNode.svelte';
	import Footer from './ui/Footer.svelte';
	import StoreView from './ui/StoreView.svelte';

	let sAppVersion = '0.4.2';
	let sDataVersion = relationshipMap.sDataVersion;
	let bHideEmptyGroups = false;

	// set the initial active person as the first in the list
	if (Object.keys($familyTreeData.activePerson).length == 0) {
		setActivePerson($familyTreeData.aAllPeople[0]);
	}

	let blockContextMenu = (event) => {
		event.preventDefault();
	};
</script>

<main>
	<div id="app-container" class="app-container" on:contextmenu={blockContextMenu}>
		<div id="tree-canvas" class="tree-canvas">
			<div id="upper-generation-block" class="upper-generation-block">
				<GenerationRow rowHeight={stylingConstants.sizes.generationRowHeight}>
					<div slot="row-left-flank" class="row-flank">
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
							personNodeGroupData={{
								groupId: relationshipMap.greatAunclesMaternal.id,
								groupName: relationshipMap.greatAunclesMaternal.label,
								groupMembers: $familyTreeData.activePerson.relationships.greatAunclesMaternal,
								compatibleGroups: greatAunclesCompatibleGroups
							}}
						/>
					</div>

					<div slot="row-middle-section" class="row-flank">
						<PersonNodeGroup
							personNodeGroupData={{
								groupId: relationshipMap.grandparentsMaternal.id,
								groupName: relationshipMap.grandparentsMaternal.label,
								groupMembers: $familyTreeData.activePerson.relationships.grandparentsMaternal,
								compatibleGroups: grandparentsCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							personNodeGroupData={{
								groupId: relationshipMap.grandparentsPaternal.id,
								groupName: relationshipMap.grandparentsPaternal.label,
								groupMembers: $familyTreeData.activePerson.relationships.grandparentsPaternal,
								compatibleGroups: grandparentsCompatibleGroups
							}}
						/>
					</div>

					<div slot="row-right-flank" class="row-flank">
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
							personNodeGroupData={{
								groupId: relationshipMap.greatAunclesPaternal.id,
								groupName: relationshipMap.greatAunclesPaternal.label,
								groupMembers: $familyTreeData.activePerson.relationships.greatAunclesPaternal,
								compatibleGroups: greatAunclesCompatibleGroups
							}}
						/>
					</div>
				</GenerationRow>
				<GenerationRow rowHeight={stylingConstants.sizes.generationRowHeight}>
					<div slot="row-left-flank" class="row-flank">
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
							personNodeGroupData={{
								groupId: relationshipMap.aunclesMaternal.id,
								groupName: relationshipMap.aunclesMaternal.label,
								groupMembers: $familyTreeData.activePerson.relationships.aunclesMaternal,
								compatibleGroups: aunclesCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
							personNodeGroupData={{
								groupId: relationshipMap.stepparentsMaternal.id,
								groupName: relationshipMap.stepparentsMaternal.label,
								groupMembers: $familyTreeData.activePerson.relationships.stepparentsMaternal,
								compatibleGroups: parentsCompatibleGroups
							}}
						/>
					</div>
					<PersonNodeGroup
						slot="row-middle-section"
						personNodeGroupData={{
							groupId: relationshipMap.parents.id,
							groupName: relationshipMap.parents.label,
							groupMembers: $familyTreeData.activePerson.relationships.parents,
							compatibleGroups: parentsCompatibleGroups
						}}
					/>
					<div slot="row-right-flank" class="row-flank">
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
							personNodeGroupData={{
								groupId: relationshipMap.stepparentsPaternal.id,
								groupName: relationshipMap.stepparentsPaternal.label,
								groupMembers: $familyTreeData.activePerson.relationships.stepparentsPaternal,
								compatibleGroups: parentsCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
							personNodeGroupData={{
								groupId: relationshipMap.aunclesPaternal.id,
								groupName: relationshipMap.aunclesPaternal.label,
								groupMembers: $familyTreeData.activePerson.relationships.aunclesPaternal,
								compatibleGroups: aunclesCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
							personNodeGroupData={{
								groupId: relationshipMap.parentsInLaw.id,
								groupName: relationshipMap.parentsInLaw.label,
								groupMembers: $familyTreeData.activePerson.relationships.parentsInLaw,
								compatibleGroups: parentsCompatibleGroups
							}}
						/>
					</div>
				</GenerationRow>
			</div>

			<div id="siblings-generation-block" class="siblings-generation-block">
				<GenerationRow rowHeight={stylingConstants.sizes.generationRowHeight}>
					<div slot="row-left-flank" class="row-flank">
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
							personNodeGroupData={{
								groupId: relationshipMap.siblingsInLaw.id,
								groupName: relationshipMap.siblingsInLaw.label,
								groupMembers: $familyTreeData.activePerson.relationships.siblingsInLaw,
								compatibleGroups: siblingsCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
							personNodeGroupData={{
								groupId: relationshipMap.stepsiblings.id,
								groupName: relationshipMap.stepsiblings.label,
								groupMembers: $familyTreeData.activePerson.relationships.stepsiblings,
								compatibleGroups: siblingsCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							personNodeGroupData={{
								groupId: relationshipMap.halfSiblingsMaternal.id,
								groupName: relationshipMap.halfSiblingsMaternal.label,
								groupMembers: $familyTreeData.activePerson.relationships.halfSiblingsMaternal,
								compatibleGroups: siblingsCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							personNodeGroupData={{
								groupId: relationshipMap.siblings.id,
								groupName: relationshipMap.siblings.label,
								groupMembers: $familyTreeData.activePerson.relationships.siblings,
								compatibleGroups: siblingsCompatibleGroups
							}}
						/>
					</div>

					<div
						slot="row-middle-section"
						id="active-person-container"
						class="active-person-container"
					>
						<PersonNode sPersonId={$familyTreeData.activePerson.id} />
					</div>

					<div slot="row-right-flank" class="row-flank">
						<PersonNodeGroup
							personNodeGroupData={{
								groupId: relationshipMap.halfSiblingsPaternal.id,
								groupName: relationshipMap.halfSiblingsPaternal.label,
								groupMembers: $familyTreeData.activePerson.relationships.halfSiblingsPaternal,
								compatibleGroups: siblingsCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
							personNodeGroupData={{
								groupId: relationshipMap.spouses.id,
								groupName: relationshipMap.spouses.label,
								groupMembers: $familyTreeData.activePerson.relationships.spouses,
								compatibleGroups: spouseCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
							personNodeGroupData={{
								groupId: relationshipMap.spouseStepsiblings.id,
								groupName: relationshipMap.spouseStepsiblings.label,
								groupMembers: $familyTreeData.activePerson.relationships.spouseStepsiblings,
								compatibleGroups: siblingsCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
							personNodeGroupData={{
								groupId: relationshipMap.exSpouses.id,
								groupName: relationshipMap.exSpouses.label,
								groupMembers: $familyTreeData.activePerson.relationships.exSpouses,
								compatibleGroups: spouseCompatibleGroups
							}}
						/>
					</div>
				</GenerationRow>
			</div>

			<div id="lower-generation-block" class="lower-generation-block">
				<GenerationRow rowHeight={stylingConstants.sizes.generationRowHeight}>
					<div slot="row-left-flank" class="row-flank">
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
							personNodeGroupData={{
								groupId: relationshipMap.niblings.id,
								groupName: relationshipMap.niblings.label,
								groupMembers: $familyTreeData.activePerson.relationships.niblings,
								compatibleGroups: niblingsCompatibleGroups
							}}
						/>
					</div>
					<PersonNodeGroup
						slot="row-middle-section"
						personNodeGroupData={{
							groupId: relationshipMap.children.id,
							groupName: relationshipMap.children.label,
							groupMembers: $familyTreeData.activePerson.relationships.children,
							compatibleGroups: childrenCompatibleGroups
						}}
					/>
					<div slot="row-right-flank" class="row-flank">
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
							personNodeGroupData={{
								groupId: relationshipMap.stepchildren.id,
								groupName: relationshipMap.stepchildren.label,
								groupMembers: $familyTreeData.activePerson.relationships.stepchildren,
								compatibleGroups: childrenCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							bHideIfEmpty={bHideEmptyGroups}
							personNodeGroupData={{
								groupId: relationshipMap.childrenInLaw.id,
								groupName: relationshipMap.childrenInLaw.label,
								groupMembers: $familyTreeData.activePerson.relationships.childrenInLaw,
								compatibleGroups: childrenCompatibleGroups
							}}
						/>
					</div>
				</GenerationRow>
			</div>
		</div>
		<Footer {sAppVersion} {sDataVersion} />
		<StoreView />
	</div>
</main>

<style>
	:root {
		font-family: proxima-nova, sans-serif;
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

	.row-flank {
		display: flex;
		gap: 2em;
	}
</style>
