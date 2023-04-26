<script>
	import familyTreeData from '../../stores/family-tree-data';
</script>

<div id="storeview-container" class="storeview-container">
	<div id="storeview-output" class="storeview-output">
		{JSON.stringify($familyTreeData)}
	</div>
</div>

<style>
	.storeview-container {
		position: relative;
		width: 100%;
		padding: 0px 10px 10px 10px;
	}
</style>
