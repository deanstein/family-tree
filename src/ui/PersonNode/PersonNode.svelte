<script>
	import { css } from '@emotion/css';

	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';

	import {
		getPersonById,
		setActivePerson,
		upgradePersonData,
		syncActivePersonToTree
	} from '../../logic/personManagement';

	import { defaultPerson } from '../../stores/relationshipMap';
	import familyTreeData from '../../stores/familyTreeData';
	import uiState from '../../stores/uiState';
	import stylingConstants from '../../stores/stylingConstants';

	import NodeSettingsButton from './NodeSettingsButton.svelte';
	import RelationshipTypePicker from './RelationshipTypePicker.svelte';
	import TextInput from './NameInput.svelte';

	export let sPersonId;
	export let sRelationshipId;
	export let bIsNodeInEditMode = false;

	$: {
		if (sPersonId == $uiState.sPersonIdForNodeEdit && sPersonId != undefined) {
			bIsNodeInEditMode = true;
		} else {
			bIsNodeInEditMode = false;
		}
	}

	const personNodeOnClick = () => {
		// clicking on the active person will pull up the detailed view
		if (sPersonId === $familyTreeData.activePerson.id) {
			// TODO: show person detail view
		} else {
			// clicking on anyone else makes them the active person
			const upgradedPersonData = upgradePersonData(defaultPerson, getPersonById(sPersonId));
			setActivePerson(upgradedPersonData);
			syncActivePersonToTree();
		}
	};

	const personNodeDynamicClass = css`
		background-color: ${stylingConstants.colors.sPersonNodeColor};
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
	id="person-node-{sPersonId}"
	class="person-node {personNodeDynamicClass}"
	on:click={personNodeOnClick}
	on:keydown|stopPropagation
	in:receive={{ key: sPersonId }}
	out:send={{ key: sPersonId }}
>
	<NodeSettingsButton {sPersonId} {bIsNodeInEditMode} />
	<div id='person-node-content-area' class='person-node-content-area'>
		<div id="person-node-name" class="person-node-name {personNodeNameDynamicClass}">
			<TextInput
				sInputValue={getPersonById(sPersonId).name}
				bEnabled={bIsNodeInEditMode}
				{sPersonId}
			/>
		</div>
		{#if sPersonId !== $familyTreeData.activePerson.id}
			<RelationshipTypePicker bEnabled={bIsNodeInEditMode} sPersonId={sPersonId} sInputValue={sRelationshipId}/>
		{/if}
	</div>
</div>

<style>
	.person-node {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.person-node-content-area {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.person-node-name {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
