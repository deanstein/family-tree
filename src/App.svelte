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
	let generationRowHeight = (100 / (nGenerationsDown + nGenerationsUp + 1) + 'vh');
</script>

<main>
	<div id="tree-canvas" class='tree-canvas'>
		<div id='parents-row"=' class='parents-row'>
			<GenerationRow>
				<PersonNodeGroup
				personNodeGroupData={{
					groupName: 'Parents',
					groupMembers: $familyTreeData.activePerson.parents
				}}
				/>
			</GenerationRow>
		</div>

		<div id="siblings-spouses-row" class="siblings-spouses-row">
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

		<div id="children-row" class="children-row">
			<GenerationRow />
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

	.tree-canvas {
		display: grid;
		gap: 2vh;
		padding: 2vh;
	}
</style>
