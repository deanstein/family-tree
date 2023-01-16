<script>
  import familyTreeData from ".././stores/familyTreeData";
</script>

<main>
  <div id='row' class='row'>
    <slot></slot>
  </div>
</main>

<style>
  .siblingsContainer {
    display: flex;
    background-color: lightgray;
  }
</style>
