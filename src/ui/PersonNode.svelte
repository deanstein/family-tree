<script>
	import { css } from '@emotion/css';
	import { slide } from 'svelte/transition';
	import {
		setActivePerson,
		upgradePersonData,
		syncActivePersonToTree
	} from '../logic/personManagement';

	import { defaultPerson } from '../stores/relationshipMap';
	import stylingConstants from '../stores/stylingConstants';

	export let personData;

	const personNodeOnClick = () => {
		const upgradedPersonData = upgradePersonData(defaultPerson, personData);
		setActivePerson(upgradedPersonData);
		syncActivePersonToTree();
	};

	const personNodeDynamicClass = css`
		width: ${stylingConstants.sizes.personNodeSize};
		height: ${stylingConstants.sizes.personNodeSize};
	`;

	const personNodeNameDynamicClass = css`
		font-size: ${stylingConstants.sizes.personNodeFontSize};
		padding: ${stylingConstants.sizes.padding};
	`;
</script>

<div
	id="person-node"
	class="person-node {personNodeDynamicClass}"
	on:click={personNodeOnClick}
	on:keydown={personNodeOnClick}
	transition:slide
>
	<div id="person-node-name" class={personNodeNameDynamicClass}>
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
