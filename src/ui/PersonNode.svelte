<script>
	import { css } from '@emotion/css';
	import { slide } from 'svelte/transition';
	import { setActivePerson } from '../logic/personManagement';

	import stylingConstants from '../stores/stylingConstants';


	export let personData;

	const switchActivePerson = () => {
		setActivePerson(personData);
	};

	const personNodeDynamicClass = css`
		width: ${stylingConstants.sizes.personNodeSize};
		height: ${stylingConstants.sizes.personNodeSize};
	`
</script>

<div
	id="person-node"
	class="person-node {personNodeDynamicClass}"
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
		background-color: orange;
	}
</style>
