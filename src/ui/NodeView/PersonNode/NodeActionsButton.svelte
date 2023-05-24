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

	let actionsButtonText;
	let nodeActionsButtonDynamicClass;

	let onNodeActionButtonClick = () => {
		showPersonNodeActionsModal(personId, name, relationshipId, groupId, compatibleGroups);
	};

	$: {
		actionsButtonText = '...';

		nodeActionsButtonDynamicClass = css`
			z-index: ${stylingConstants.zIndices.personNodeSettingsZIndex};
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
			class="{nodeActionsButtonDynamicClass} node-actions-button"
			on:click|stopPropagation={onNodeActionButtonClick}>{actionsButtonText}</button
		>
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
	}
</style>
