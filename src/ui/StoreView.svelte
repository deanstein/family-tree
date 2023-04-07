<script>
	import familyTreeData from '../stores/familyTreeData';
	import { getFamilyTreeDataFromRepo, writeCurrentFamilyTreeDataToRepo } from '../logic/persistenceManagement';

	const getDataButtonOnclickAction = () => {
		getFamilyTreeDataFromRepo('0', '8890');
	}

	const setDataButtonOnClickAction = () => {
		writeCurrentFamilyTreeDataToRepo();
	}
</script>

<div id="storeview-outer-container" class="storeview-outer-container">
	<div id="storeview-inner-container" class="storeview-inner-container">
		<div id="storeview-title" class="storeview-title">
			<div id='testWriteButton' >
				<button on:click={getDataButtonOnclickAction}>
					GET DATA
				</button>
				<button on:click={setDataButtonOnClickAction}>
					SEND DATA
				</button>
			</div>StoreView</div>
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
