<script>
    import { onMount } from "svelte";
    import { getFileFromRepo } from "../logic/persistenceManagement";
    
    let sInputValue;
    let familyTreeDataMap;
    
    // first, get the family tree data map
    const initializeFamilyTreeDataSelector = async () => {
      familyTreeDataMap = await getFileFromRepo('family-tree-data-map.json', '8890');
      console.log(familyTreeDataMap);
    }
    
    onMount(async () => {
      await initializeFamilyTreeDataSelector();
    });
  </script>
    
  <div id="family-tree-data-selector-container" class="storeview-toolbar-outer-container">
    {#if familyTreeDataMap}
      <select id="options" class="family-tree-data-selector" bind:value={sInputValue}>
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
  