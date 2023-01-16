<script>
	import familyTreeData from './stores/familyTreeData';
	import PersonNode from './ui/PersonNode.svelte';
	import Row from './ui/Row.svelte';
</script>

<main>
	<div id="tree-canvas">
		<div id="parents-row" class="parents-row">
			<Row />
		</div>

		<div id="siblings-spouses-row" class="siblings-spouses-row">
			<Row>
				{#each $familyTreeData.people as { person }, i}
					<PersonNode personData={$familyTreeData.people[i]} />
				{/each}
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
