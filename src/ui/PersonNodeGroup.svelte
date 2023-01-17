<script>
	import familyTreeData from '../stores/familyTreeData';
	import PersonNode from './PersonNode.svelte';
	import { findPersonByName } from '../logic/personManagement';
	export let personNodeGroupData;

	familyTreeData.subscribe((currentValue) => {
		console.log(personNodeGroupData.groupMembers);
		// convert a name to a person if necessary
		for (let i = 0; i < personNodeGroupData.groupMembers.length; i++) {
			if (
				personNodeGroupData.groupMembers[i] &&
				typeof personNodeGroupData.groupMembers[i] === 'string' &&
				personNodeGroupData.groupMembers[i].constructor === String
			) {
				personNodeGroupData.groupMembers[i] = findPersonByName(
					personNodeGroupData.groupMembers[i],
					true
				);
			}
		}
	});
</script>

<main>
	<div id="person-node-group" class="person-node-group">
		{personNodeGroupData.groupName}
		{#each personNodeGroupData.groupMembers as { person }, i}
			<PersonNode personData={personNodeGroupData.groupMembers[i]} />
		{/each}
	</div>
</main>

<style>
	.person-node-group {
		display: flex;
		margin: 10px;
		background-color: lightblue;
		height: 150px;
		width: 150px;
	}
</style>
