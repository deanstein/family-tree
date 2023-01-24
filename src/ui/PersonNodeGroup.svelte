<script>
	import PersonNode from './PersonNode.svelte';
	export let personNodeGroupData;
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
