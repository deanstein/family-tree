<script>
	import { css } from '@emotion/css';

	import uiState from '../../../stores/uiState';

	import stylingConstants from '../../../stores/stylingConstants';

	import { removePersonFromActivePersonGroup } from '../../../logic/personManagement';
	import {
		startNodeEditingMode,
		endNodeEditingMode,
		toggleNodeSettingsFlyout,
		hideNodeSettingsFlyout
	} from '../../../logic/uiManagement.js';

	export let sPersonId;
	export let sRelationshipId;
	export let bIsNodeInEditMode;

	let settingsButtonText;
	let nodeSettingsButtonTextDynamicClass;

	$: {
		settingsButtonText = bIsNodeInEditMode ? 'done' : '...';

		nodeSettingsButtonTextDynamicClass = css`
			color: ${bIsNodeInEditMode ? 'white' : 'black'};
			background-color: ${bIsNodeInEditMode ? 'green' : 'transparent'};
			border: 2px solid transparent;
			:hover {
				background-color: ${stylingConstants.colors.sHoverColor};
			}
		`;
	}

	const nodeSettingsFlyoutDynamicClass = css`
		ul {
			border: 2px solid ${stylingConstants.colors.sHoverColor};
		}
		a {
			background-color: ${stylingConstants.colors.sPersonNodeColor};
			:hover {
				background-color: ${stylingConstants.colors.sHoverColor};
		}
	`;

	const onDoneButtonClick = () => {
		endNodeEditingMode(sPersonId, sRelationshipId);
	};

	const onEditButtonClick = () => {
		startNodeEditingMode(sPersonId);
		hideNodeSettingsFlyout();
	};

	const onRemoveButtonClick = () => {
		removePersonFromActivePersonGroup(sPersonId, sRelationshipId);
	};
</script>

<div id="node-settings-button-container" class="node-settings-button-container">
	<button
		type="button"
		id="settings-button"
		class="{nodeSettingsButtonTextDynamicClass} node-settings-button"
		on:click|stopPropagation={bIsNodeInEditMode
			? onDoneButtonClick
			: () => toggleNodeSettingsFlyout(sPersonId)}>{settingsButtonText}</button
	>

	{#if $uiState.sPersonIdForNodeSettingsFlyout == sPersonId}
		<div
			id="node-settings-flyout-menu"
			class="{nodeSettingsFlyoutDynamicClass} node-settings-flyout-menu"
		>
			<ul>
				<li><a on:click|stopPropagation={onEditButtonClick}>Edit</a></li>
				<li><a on:click|stopPropagation={onRemoveButtonClick}>Remove</a></li>
			</ul>
		</div>
	{/if}
</div>

<style>
	.node-settings-button-container {
		position: relative;
		width: 100%;
		float: right;
	}

	.node-settings-button {
		position: absolute;
		top: 0px;
		right: 0px;
		border: none;
		letter-spacing: 2px;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		font-weight: bold;
	}

	.node-settings-flyout-menu {
		position: relative;
		top: 0;
		left: 100%;
		width: 200px;
		z-index: 1;
	}

	.node-settings-flyout-menu ul {
		position: absolute;
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.node-settings-flyout-menu li {
		margin: 0;
		padding: 0;
	}

	.node-settings-flyout-menu a {
		display: block;
		padding: 5px;
		text-decoration: none;
		color: #000;
	}
</style>
