<script>
	import familyTreeData from '../../stores/familyTreeData';
	import StoreViewToolbar from './StoreViewToolbar.svelte';
</script>

<div id="storeview-outer-container" class="storeview-outer-container">
	<div id="storeview-inner-container" class="storeview-inner-container">
		<div id="storeview-title" class="storeview-title">StoreView</div>
		<StoreViewToolbar />
		<div id="storeview-output" class="storeview-output">
			{JSON.stringify($familyTreeData)}
		</div>
	</div>
</div>

<style>
	.storeview-outer-container {
		display: flex;
		flex-direction: column;
		background-color: lightgray;
	}

	.storeview-inner-container {
		position: relative;
		width: 100%;
	}

	.storeview-title {
		vertical-align: middle;
		align-items: center;
		justify-content: center;
		display: inline-flex;
		width: 100%;
		height: 4vh;
		background-color: darkgray;
	}
</style>
