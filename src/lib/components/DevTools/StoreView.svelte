<script>
	import { allFamilyTreeStateValues } from '$lib/states/family-tree-state';
	import { allTempStateValues } from '$lib/states/temp-state';
	import { allUiStateValues } from '$lib/states/ui-state';
</script>

<div class="storeview-container">
	<div class="storeview-output">
		<div class="store-container">
			<div>Temp State:</div>
			{JSON.stringify($allTempStateValues)}
		</div>
		<div class="store-container">
			<div>UI State:</div>
			{JSON.stringify($allUiStateValues)}
		</div>
		<div class="store-container">
			<div>Active Family Tree State:</div>
			{JSON.stringify($allFamilyTreeStateValues)}
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
