<script>
	import { afterUpdate, onMount } from 'svelte';
	import { getFileFromRepo } from '../logic/persistenceManagement';
	import { initializeOffScreenPeopleIdsArray, getRepoFamilyTreeAndSetActive } from '../logic/uiManagement';

	let sInputValue;
	let familyTreeDataMap;

	onMount(async () => {
		await initializeFamilyTreeDataSelector();
	});

	afterUpdate(async () => {
		await getRepoFamilyTreeAndSetActive('0', '8890');
	});

	// initialize the picker with the available family trees from the map
	const initializeFamilyTreeDataSelector = async (event) => {
		familyTreeDataMap = await getFileFromRepo('family-tree-data-map.json', '8890');
	};

	const handleSelectChange = async (event) => {
		const selectedValue = event.target.value;
		await getRepoFamilyTreeAndSetActive(selectedValue, '8890');
        initializeOffScreenPeopleIdsArray();
	};
</script>

<div id="family-tree-data-selector-container" class="storeview-toolbar-outer-container">
	{#if familyTreeDataMap}
		<select
			id="options"
			class="family-tree-data-selector"
			bind:value={sInputValue}
			on:change={handleSelectChange}
		>
			{#each Object.values(familyTreeDataMap) as data}
				<option value={data.id}>{data.name}</option>
			{/each}
		</select>
	{:else}
		<p>Loading...</p>
	{/if}
</div>

<style>
</style>
