<script>
	import familyTreeData from './stores/familyTreeData';

	import { setActivePerson } from './logic/personManagement';

	import PersonNode from './ui/PersonNode.svelte';
	import PersonNodeGroup from './ui/PersonNodeGroup.svelte';
	import GenerationRow from './ui/GenerationRow.svelte';
	import StoreView from './ui/StoreView.svelte';

	if (($familyTreeData.activePerson = {})) {
		setActivePerson($familyTreeData.people[0]);
	}

	let nGenerationsUp = 2;
	let nGenerationsDown = 1;
	let generationRowHeight = 100 / (nGenerationsDown + nGenerationsUp + 1) + 'vh';
</script>

<main>
	<div id='app-container' class='app-container'>
		<div id="tree-canvas" class="tree-canvas">
			<div id="upper-generation-section" class="upper-generation-section">
				<GenerationRow>
					<div></div>
					<PersonNodeGroup
						personNodeGroupData={{
							groupName: 'Parents',
							groupMembers: $familyTreeData.activePerson.parents
						}}
					/>
				</GenerationRow>
			</div>
	
			<div id="siblings-generation-section" class="siblings-generation-section">
				<GenerationRow nColumns={3} rowHeight={generationRowHeight}>
					<PersonNodeGroup
						personNodeGroupData={{
							groupName: 'Sibings',
							groupMembers: $familyTreeData.activePerson.siblings
						}}
					/>
					<PersonNode personData={$familyTreeData.activePerson} />
				</GenerationRow>
			</div>
	
			<div id="lower-generation-section" class="lower-generation-section">
				<GenerationRow nColumns={3} rowHeight={generationRowHeight}>
					<PersonNodeGroup
						personNodeGroupData={{
							groupName: 'Children',
							groupMembers: $familyTreeData.activePerson.siblings
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
		font-size: 0.75rem;
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
</style>
