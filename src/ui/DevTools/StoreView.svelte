<script>
	import familyTreeData from '../../stores/family-tree-data';
	import tempState from '../../stores/temp-state';
	import uiState from '../../stores/ui-state';
</script>

<div id="storeview-container" class="storeview-container">
	<div id="storeview-output" class="storeview-output">
		<div>Temp State:</div>
		{JSON.stringify($tempState)}
		<div>UI State:</div>
		{JSON.stringify($uiState)}
		<div>Family Tree Data:</div>
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
