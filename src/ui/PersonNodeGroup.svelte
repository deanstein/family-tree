<script>
	import PersonNodeAddButton from './PersonNodeAddButton.svelte';
	import PersonNodePlaceholder from './PersonNodePlaceholder.svelte';
	import PersonNode from './PersonNode.svelte';
	export let personNodeGroupData = {
		groupName: 'A Group of People',
		groupMembers: ['John', 'Jane', 'Jim']
	};
</script>

<div class="person-node-group-plus-button">
	<div id="person-node-group-outer-container" class="person-node-group-outer-container">
		<div id="person-node-group-title" class="person-node-group-title">
			{personNodeGroupData.groupName}
		</div>
		<div id="person-node-group-interior-container" class="person-node-group-inner-container">
			{#if personNodeGroupData.groupMembers.length == 0}
				<PersonNodePlaceholder />
			{/if}
			{#each personNodeGroupData.groupMembers as { person }, i}
				<PersonNode personData={personNodeGroupData.groupMembers[i]} />
			{/each}
		</div>
	</div>
	{#if personNodeGroupData.groupMembers.length > 0}
		<PersonNodeAddButton />
	{/if}
</div>

<style>
	.person-node-group-plus-button {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		background-color: lightblue;
	}

	.person-node-group-outer-container {
		display: flex;
		flex-direction: column;
		margin: 10px;
	}

	.person-node-group-inner-container {
		display: flex;
		flex-direction: row;
		gap: 1vh;
		padding: 1vh;
	}

	.person-node-group-title {
		align-items: center;
		justify-content: center;
		display: inline-flex;
		width: 100%;
		height: 1.5em;
		background-color: darkgray;
	}
</style>
