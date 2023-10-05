<script>
	import { onMount } from 'svelte';
	import { getFileFromRepo } from '../logic/persistence-management';
	import { getRepoFamilyTreeAndSetActive } from '../logic/ui-management';

	let sInputValue;
	let familyTreeDataMap;

	onMount(async () => {
		await getAvailableFamilyTrees();
	});

	// initialize the picker with the available family trees from the map
	const getAvailableFamilyTrees = async () => {
		familyTreeDataMap = await getFileFromRepo('family-tree-data-map.json', '8890');
	};

	const handleSelectChange = async (event) => {
		const selectedValue = event.target.value;
		await getRepoFamilyTreeAndSetActive(selectedValue, '8890');
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
			<option disabled selected value="-1">Choose a family tree...</option>
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
