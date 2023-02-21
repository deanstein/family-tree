<script>
	import familyTreeData from '../../stores/familyTreeData';
</script>

<div id="person-node" class="person-node">
	{$familyTreeData.people}
</div>

<style>
	.person-node {
		margin: 10px;
		background-color: orange;
		height: 150px;
		width: 150px;
	}
</style>
