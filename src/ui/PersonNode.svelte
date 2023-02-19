<script>
	import { css } from '@emotion/css';

	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';

	import {
		getPersonById,
		setActivePerson,
		upgradePersonData,
		syncActivePersonToTree
	} from '../logic/personManagement';

	import { defaultPerson } from '../stores/relationshipMap';
	import familyTreeData from '../stores/familyTreeData';
	import stylingConstants from '../stores/stylingConstants';
	import TextInput from './TextInput.svelte';

	export let personId;

	const personNodeOnClick = () => {
		// clicking on the active person will pull up the detailed view
		if (personId === $familyTreeData.activePerson.id) {
			// TODO: show person detail view
		} else {
			// clicking on anyone else makes them the active person
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

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 300,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});
</script>

<div
	id="person-node"
	class="person-node {personNodeDynamicClass}"
	on:click={personNodeOnClick}
	on:keydown={personNodeOnClick}
	in:receive={{ key: personId }}
	out:send={{ key: personId }}
>
	<div id="person-node-name" class='person-node-name {personNodeNameDynamicClass}'>
		<TextInput inputValue={getPersonById(personId).name}/>
	</div>
</div>

<style>
	.person-node {
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: whitesmoke;
	}

	.person-node-name {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

</style>
