<script>
	import { css } from '@emotion/css';

	import uiState from '../../../stores/ui-state';

	import stylingConstants from '../../styling-constants';

	import { showPersonNodeActionsModal } from '../../../logic/temp-management';

	export let personId;
	export let relationshipId;
	export let groupId;
	export let name;
	export let compatibleGroups;

	let actionsButtonDynamicClass;
	let actionsButtonFaIcon = 'fa-ellipsis';

	let onNodeActionButtonClick = () => {
		showPersonNodeActionsModal(personId, name, relationshipId, groupId, compatibleGroups);
	};

	const iconDynamicClass = css`
		color: ${stylingConstants.colors.textColorLight};
	`;

	$: {
		actionsButtonDynamicClass = css`
			z-index: ${stylingConstants.zIndices.personNodeOverlayZIndex};
			border: 2px solid transparent;
			font-size: ${stylingConstants.sizes.personNodeFontSize};
			:hover {
				background-color: ${stylingConstants.colors.hoverColor};
			}
		`;
	}
</script>

{#if personId !== $uiState.activePerson.id}
	<div id="node-actions-button-container" class="node-actions-button-container">
		<button
			type="button"
			id="settings-button"
			class="{actionsButtonDynamicClass} node-actions-button"
			on:click|stopPropagation={onNodeActionButtonClick}
		>
			<i title="Edit relationship" class="{iconDynamicClass} fa-solid {actionsButtonFaIcon}" />
		</button>
	</div>
{/if}

<style>
	.node-actions-button-container {
		width: 100%;
		float: right;
	}

	.node-actions-button {
		position: absolute;
		top: 0px;
		right: 0px;
		border: none;
		letter-spacing: 2px;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		color: black;
		background-color: transparent;
		font-weight: bold;
		border-radius: 5px;
		cursor: pointer;
	}
</style>
