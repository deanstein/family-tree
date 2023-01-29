<script>
	import { slide } from 'svelte/transition';
	import { setActivePerson } from '../logic/personManagement';
	export let personData;

	const switchActivePerson = () => {
		setActivePerson(personData);
	};
</script>

<div
	id="person-node"
	class="person-node"
	on:click={switchActivePerson}
	on:keydown={switchActivePerson}
	transition:slide
>
	<div>
		{personData.name}
	</div>
</div>

<style>
	.person-node {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 15vh;
		width: 15vh;
		background-color: orange;
	}
</style>
