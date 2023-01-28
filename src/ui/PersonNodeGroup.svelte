<script>
	import PersonNode from './PersonNode.svelte';
	export let personNodeGroupData = {
		groupName: 'A Group of People',
		groupMembers: ['John', 'Jane', 'Jim']
	};
</script>


<div id="person-node-group-outer-container" class="person-node-group-outer-container">
	<div id="person-node-group-title" class="person-node-group-title">
		{personNodeGroupData.groupName}
	</div>
	<div id="person-node-group-interior-container" class="person-node-group-inner-container">
		{#each personNodeGroupData.groupMembers as { person }, i}
			<PersonNode personData={personNodeGroupData.groupMembers[i]} />
		{/each}
	</div>
</div>

<style>
	.person-node-group-outer-container {
		display: flex;
		flex-direction: column;
		margin: 10px;
		background-color: lightblue;
	}

	.person-node-group-inner-container {
		display: flex;
		flex-direction: row;
		gap: 1vh;
		padding: 1vh;
		background-color: lightblue;
	}

	.person-node-group-title {
		vertical-align: middle;
		align-items: center;
		justify-content: center;
		display: inline-flex;
		width: 100%;
		height: 1.5em;
		background-color: darkgray;
	}
</style>
