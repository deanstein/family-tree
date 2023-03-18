<script>
	import familyTreeData from '../../../stores/familyTreeData';

	import PersonNode from '../PersonNode/PersonNode.svelte';
</script>

<div id="person-node-scrolling-window-container" class="person-node-scrolling-window-container">
	{#each $familyTreeData.aAvailablePeopleIdsFiltered as sPersonId}
		<PersonNode
        sPersonId={sPersonId}
		bTrackActiveState={true}
    />
	{/each}
</div>

<style>
	.person-node-scrolling-window-container {
		display: flex;
		position: absolute;
		justify-content: center;
		top: 100%;
		gap: 10px;
		z-index: 1;
		padding: 10px;
		background-color: gray;
	}
</style>
