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
	import NodeGroup from './ui/NodeView/PersonNodeGroup/PersonNodeGroup.svelte';
	import PersonNode from './ui/NodeView/PersonNode/PersonNode.svelte';
	import Footer from './ui/Footer.svelte';
	import StoreView from './ui/StoreView.svelte';

	let sAppVersion = 'v0.2.0';
	let sDataVersion = relationshipMap.sDataVersion;

	// set the initial active person as the first in the list
	if (Object.keys($familyTreeData.activePerson).length == 0) {
		setActivePerson($familyTreeData.people[0]);
	}

	let blockContextMenu = (event) => {
		event.preventDefault();
	};
</script>

<main>
	<div id="app-container" class="app-container" on:contextmenu={blockContextMenu}>
		<div id="tree-canvas" class="tree-canvas">
			<div id="upper-generation-section" class="upper-generation-section">
				<GenerationRow rowHeight={stylingConstants.sizes.generationRowHeight}>
					<div />
					<NodeGroup
						slot="row-middle-section"
						personNodeGroupData={{
							groupId: relationshipMap.parents.id,
							groupName: relationshipMap.parents.label,
							groupMembers: $familyTreeData.activePerson.relationships.parents,
							compatibleGroups: parentsCompatibleGroups
						}}
					/>
				</GenerationRow>
			</div>

			<div id="siblings-generation-section" class="siblings-generation-section">
				<GenerationRow rowHeight={stylingConstants.sizes.generationRowHeight}>
					<NodeGroup
						slot="row-left-section"
						personNodeGroupData={{
							groupId: relationshipMap.siblings.id,
							groupName: relationshipMap.siblings.label,
							groupMembers: $familyTreeData.activePerson.relationships.siblings,
							compatibleGroups: siblingsCompatibleGroups
						}}
					/>
					<div
						slot="row-middle-section"
						id="active-person-container"
						class="active-person-container"
					>
						<PersonNode sPersonId={$familyTreeData.activePerson.id} />
					</div>
					<NodeGroup
						slot="row-right-section"
						personNodeGroupData={{
							groupId: relationshipMap.spouses.id,
							groupName: relationshipMap.spouses.label,
							groupMembers: $familyTreeData.activePerson.relationships.spouses,
							compatibleGroups: spouseCompatibleGroups
						}}
					/>
				</GenerationRow>
			</div>

			<div id="lower-generation-section" class="lower-generation-section">
				<GenerationRow rowHeight={stylingConstants.sizes.generationRowHeight}>
					<NodeGroup
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

	.upper-generation-section {
		display: grid;
		width: 100vw;
	}

	.siblings-generation-section {
		display: grid;
		width: 100vw;
	}

	.lower-generation-section {
		display: grid;
		width: 100vw;
	}

	.active-person-container {
		margin-left: 5vh;
		margin-right: 5vh;
	}
</style>
