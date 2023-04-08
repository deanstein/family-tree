<script>
    import { onMount } from "svelte";
    import { getFileFromRepo } from "../logic/persistenceManagement";
	import { getRepoFamilyTreeAndSetActive } from "../logic/uiManagement";
    
    let sInputValue;
    let familyTreeDataMap;

    onMount(async () => {
      await initializeFamilyTreeDataSelector();
    });
    
    // initialize the picker with the available family trees from the map
    const initializeFamilyTreeDataSelector = async () => {
      familyTreeDataMap = await getFileFromRepo('family-tree-data-map.json', '8890');
    }

    const handleSelectChange = async (event) => {
        const selectedValue = event.target.value;
        // call your function here with the selected value as an argument
        await getRepoFamilyTreeAndSetActive(selectedValue, '8890');
    }
  </script>
    
  <div id="family-tree-data-selector-container" class="storeview-toolbar-outer-container">
    {#if familyTreeDataMap}
      <select id="options" class="family-tree-data-selector" bind:value={sInputValue} on:change={handleSelectChange}>
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
  