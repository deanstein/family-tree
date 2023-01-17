<script>
	export let personData;

  console.log(personData)
</script>

<main>
	<div id="person-node" class="person-node">
		{personData.name}
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
