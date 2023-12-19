<script>
	import familyTreeData from '$lib/stores/family-tree-data';
	import tempState from '$lib/stores/temp-state';
	import uiState from '$lib/stores/ui-state';
</script>

<div class="storeview-container">
	<div class="storeview-output">
		<div class="store-container">
			<div>Temp State:</div>
			{JSON.stringify($tempState)}
		</div>
		<div class="store-container">
			<div>UI State:</div>
			{JSON.stringify($uiState)}
		</div>
		<div class="store-container">
			<div>Family Tree Data:</div>
			{JSON.stringify($familyTreeData)}
		</div>
	</div>
</div>

<style>
	.storeview-container {
		position: relative;
		width: 100%;
		padding: 0px 10px 10px 10px;
	}

	.storeview-output {
		display: flex;
		flex-direction: column;
		gap: 1vh;

		-webkit-touch-callout: text;
		-webkit-user-select: text;
		-moz-user-select: text;
		-ms-user-select: text;
		user-select: text;
	}
</style>
