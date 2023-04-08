<script>
	import { getFamilyTreeDataFromRepo, writeCurrentFamilyTreeDataToRepo } from '../../logic/persistenceManagement';
	import FamilyTreeDataSelector from '../FamilyTreeDataSelector.svelte';

    const getDataButtonOnclickAction = () => {
        getFamilyTreeDataFromRepo('0', '8890');
    }

    const setDataButtonOnClickAction = () => {
        writeCurrentFamilyTreeDataToRepo();
    }
</script>

<div id="storeview-toolbar-outer-container" class="storeview-toolbar-outer-container">
    <FamilyTreeDataSelector />
    <button on:click={setDataButtonOnClickAction}>
        SEND DATA
    </button>
</div>

<style>
	.storeview-toolbar-outer-container {
		display: flex;
        justify-content: center;
        gap: 1vh;
        padding-top: 1vh;
        padding-bottom: 1vh;
		background-color: lightgray;
	}
</style>