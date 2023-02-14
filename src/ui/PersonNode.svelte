<script>
	import { css } from '@emotion/css';
	import { slide } from 'svelte/transition';
	import {
		getPersonById,
		setActivePerson,
		upgradePersonData,
		syncActivePersonToTree
	} from '../logic/personManagement';

	import { defaultPerson } from '../stores/relationshipMap';
	import familyTreeData from '../stores/familyTreeData';
	import stylingConstants from '../stores/stylingConstants';

	export let personId;

	const personNodeOnClick = () => {
		// clicking on the active person will pull up the detailed view
		if (personId === $familyTreeData.activePerson.id) {

			// TODO: show person detail view

		} else { // clicking on anyone else makes them the active person
			const upgradedPersonData = upgradePersonData(defaultPerson, getPersonById(personId));
			setActivePerson(upgradedPersonData);
			syncActivePersonToTree();
		}
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
		{getPersonById(personId).name}
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
