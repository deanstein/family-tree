<script>
  import familyTreeData from "./stores/familyTreeData";
  import Person from "./Person.svelte";
</script>

<main>
  <div id="treeCanvas">
    {#each $familyTreeData.people as { person }, i}
      <Person />
    {/each}
  </div>
</main>

<style>
  :root {
    font-family: proxima-nova, sans-serif;
  }

  :global(body) {
    margin: 0;
  }
</style>
