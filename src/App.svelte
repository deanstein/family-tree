<script>
	import familyTreeData from './stores/familyTreeData';
	import stylingConstants from './stores/stylingConstants';

	console.log(stylingConstants.sizes.nGenerationRowHeight);

	import { setActivePerson } from './logic/personManagement';

	import PersonNode from './ui/PersonNode.svelte';
	import PersonNodeGroup from './ui/PersonNodeGroup.svelte';
	import GenerationRow from './ui/GenerationRow.svelte';
	import StoreView from './ui/StoreView.svelte';

	if (($familyTreeData.activePerson = {})) {
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
						personNodeGroupData={{
							groupName: 'Parents',
							groupMembers: $familyTreeData.activePerson.parents
						}}
					/>
				</GenerationRow>
			</div>

			<div id="siblings-generation-section" class="siblings-generation-section">
				<GenerationRow rowHeight={stylingConstants.sizes.generationRowHeight}>
					<PersonNodeGroup
						personNodeGroupData={{
							groupName: 'Siblings',
							groupMembers: $familyTreeData.activePerson.siblings
						}}
					/>
					<div id="active-person-container" class="active-person-container">
						<PersonNode personData={$familyTreeData.activePerson} />
					</div>
					<PersonNodeGroup
						personNodeGroupData={{
							groupName: 'Spouses',
							groupMembers: $familyTreeData.activePerson.siblings
						}}
					/>
				</GenerationRow>
			</div>

			<div id="lower-generation-section" class="lower-generation-section">
				<GenerationRow rowHeight={stylingConstants.sizes.generationRowHeight}>
					<PersonNodeGroup
						personNodeGroupData={{
							groupName: 'Children',
							groupMembers: $familyTreeData.activePerson.children
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
