<script>
	import familyTreeData from './stores/familyTreeData';
	import relationshipMap from './stores/relationshipMap';
	import {
		grandparentsCompatibleGroups,
		parentsCompatibleGroups,
		siblingsCompatibleGroups,
		spouseCompatibleGroups,
		childrenCompatibleGroups
	} from './stores/relationshipMap';
	import stylingConstants from './stores/stylingConstants';

	import { setActivePerson } from './logic/personManagement';

	import GenerationRow from './ui/NodeView/GenerationRow.svelte';
	import PersonNodeGroup from './ui/NodeView/PersonNodeGroup/PersonNodeGroup.svelte';
	import PersonNode from './ui/NodeView/PersonNode/PersonNode.svelte';
	import Footer from './ui/Footer.svelte';
	import StoreView from './ui/StoreView.svelte';

	let sAppVersion = 'v0.4.0';
	let sDataVersion = relationshipMap.sDataVersion;

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
					<div />

					<div slot="row-left-flank" class="row-flank">
						<PersonNodeGroup
							personNodeGroupData={{
								groupId: relationshipMap.stepparentsMaternal.id,
								groupName: relationshipMap.stepparentsMaternal.label,
								groupMembers: $familyTreeData.activePerson.relationships.stepparentsMaternal,
								compatibleGroups: parentsCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							personNodeGroupData={{
								groupId: relationshipMap.stepparentsPaternal.id,
								groupName: relationshipMap.stepparentsPaternal.label,
								groupMembers: $familyTreeData.activePerson.relationships.stepparentsPaternal,
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
							personNodeGroupData={{
								groupId: relationshipMap.siblingsInLaw.id,
								groupName: relationshipMap.siblingsInLaw.label,
								groupMembers: $familyTreeData.activePerson.relationships.siblingsInLaw,
								compatibleGroups: siblingsCompatibleGroups
							}}
						/>
						<PersonNodeGroup
							personNodeGroupData={{
								groupId: relationshipMap.stepsiblings.id,
								groupName: relationshipMap.stepsiblings.label,
								groupMembers: $familyTreeData.activePerson.relationships.stepsiblings,
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
								groupId: relationshipMap.spouses.id,
								groupName: relationshipMap.spouses.label,
								groupMembers: $familyTreeData.activePerson.relationships.spouses,
								compatibleGroups: spouseCompatibleGroups
							}}
						/>
						<PersonNodeGroup
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
					<PersonNodeGroup
						slot="row-middle-section"
						personNodeGroupData={{
							groupId: relationshipMap.children.id,
							groupName: relationshipMap.children.label,
							groupMembers: $familyTreeData.activePerson.relationships.children,
							compatibleGroups: childrenCompatibleGroups
						}}
					/>
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
