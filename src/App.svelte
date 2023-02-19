<script>
	import familyTreeData from './stores/familyTreeData';
	import stylingConstants from './stores/stylingConstants';

	import { setActivePerson } from './logic/personManagement';

	import PersonNode from './ui/PersonNode.svelte';
	import PersonNodeGroup from './ui/PersonNodeGroup.svelte';
	import GenerationRow from './ui/GenerationRow.svelte';
	import StoreView from './ui/StoreView.svelte';
	import { relationshipMap } from './stores/relationshipMap';

	if (Object.keys($familyTreeData.activePerson).length == 0) {
		setActivePerson($familyTreeData.people[0]);
	}
</script>

<main>
	<div id="app-container" class="app-container">
		<div id="tree-canvas" class="tree-canvas">
			<div id="upper-generation-section" class="upper-generation-section">
				<GenerationRow rowHeight={stylingConstants.sizes.generationRowHeight}>
					<div />
					<PersonNodeGroup
						slot="row-middle-section"
						personNodeGroupData={{
							groupId: relationshipMap.parents.id,
							groupName: relationshipMap.parents.label,
							groupMembers: $familyTreeData.activePerson.relationships.parents
						}}
					/>
				</GenerationRow>
			</div>

			<div id="siblings-generation-section" class="siblings-generation-section">
				<GenerationRow rowHeight={stylingConstants.sizes.generationRowHeight}>
					<PersonNodeGroup
						slot="row-left-section"
						personNodeGroupData={{
							groupId: relationshipMap.siblings.id,
							groupName: relationshipMap.siblings.label,
							groupMembers: $familyTreeData.activePerson.relationships.siblings
						}}
					/>
					<div
						slot="row-middle-section"
						id="active-person-container"
						class="active-person-container"
					>
						<PersonNode sPersonId={$familyTreeData.activePerson.id} />
					</div>
					<PersonNodeGroup
						slot="row-right-section"
						personNodeGroupData={{
							groupId: relationshipMap.spouses.id,
							groupName: relationshipMap.spouses.label,
							groupMembers: $familyTreeData.activePerson.relationships.spouses
						}}
					/>
				</GenerationRow>
			</div>

			<div id="lower-generation-section" class="lower-generation-section">
				<GenerationRow rowHeight={stylingConstants.sizes.generationRowHeight}>
					<PersonNodeGroup
						slot="row-middle-section"
						personNodeGroupData={{
							groupId: relationshipMap.children.id,
							groupName: relationshipMap.children.label,
							groupMembers: $familyTreeData.activePerson.relationships.children
						}}
					/>
				</GenerationRow>
			</div>
		</div>
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
