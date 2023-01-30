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
		font-size ${stylingConstants.sizes.fontSize};
		width: ${stylingConstants.sizes.personNodeSize};
		height: ${stylingConstants.sizes.personNodeSize};
	`

	const personNodeNameDynamicClass = css`
		padding: ${stylingConstants.sizes.padding}`
</script>

<div
	id="person-node"
	class="person-node {personNodeDynamicClass}"
	on:click={switchActivePerson}
	on:keydown={switchActivePerson}
	transition:slide
>
	<div id='person-node-name' class='{personNodeNameDynamicClass}'>
		{personData.name}
	</div>
</div>

<style>
	.person-node {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: whitesmoke;
	}
</style>
