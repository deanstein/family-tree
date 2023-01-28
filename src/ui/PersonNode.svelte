<script>
	import { slide } from 'svelte/transition';
	import { setActivePerson } from '../logic/personManagement';
	export let personData;

	const switchActivePerson = () => {
		setActivePerson(personData);
	};
</script>

<main>
	<div
		id="person-node"
		class="person-node"
		on:click={switchActivePerson}
		on:keydown={switchActivePerson}
		transition:slide
	>
		{personData.name}
	</div>
</main>

<style>
	.person-node {
		height: 15vh;
		width: 15vh;
		text-align: center;
		background-color: orange;
	}
</style>
