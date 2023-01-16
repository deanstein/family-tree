<script>
  import familyTreeData from ".././stores/familyTreeData";
</script>

<main>
  <div id='person-node' class='person-node'>
    {$familyTreeData.people}
  </div>
</main>

<style>
  .person-node {
    margin: 10px;
    background-color: orange;
    height: 150px;
    width: 150px;
  }
</style>
