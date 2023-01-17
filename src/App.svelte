<script>
	import familyTreeData from './stores/familyTreeData';

  import { setActivePerson } from './logic/personManagement';

	import PersonNode from './ui/PersonNode.svelte';
  import PersonNodeGroup from './ui/PersonNodeGroup.svelte';
	import Row from './ui/Row.svelte';

  if ($familyTreeData.activePerson = {})
  {
    setActivePerson($familyTreeData.people[0])
  }
</script>

<main>
	<div id="tree-canvas">
		<div id="parents-row" class="parents-row">
			<Row />
		</div>

		<div id="siblings-spouses-row" class="siblings-spouses-row">
			<Row>
        <PersonNode personData={$familyTreeData.activePerson}/>
        <PersonNodeGroup personNodeGroupData={
          {
            groupName: 'Sibings',
            groupMembers: $familyTreeData.activePerson.siblings
          }
        }/>
			</Row>
		</div>

		<div id="children-row" class="children-row">
			<Row />
		</div>
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
