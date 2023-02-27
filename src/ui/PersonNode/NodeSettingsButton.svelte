<script>
	import { css } from '@emotion/css';

	import uiState from '../../stores/uiState';
	import stylingConstants from '../../stores/stylingConstants';

	export let sPersonId;
	export let bIsNodeInEditMode;

	let buttonText;
	let nodeSettingsButtonDynamicClass;
	$: {
		buttonText = bIsNodeInEditMode ? 'done' : '...';

		nodeSettingsButtonDynamicClass = css`
			color: ${bIsNodeInEditMode ? 'white' : 'black'};
			background-color: ${bIsNodeInEditMode ? 'green' : 'transparent'};
			border: 1px solid transparent;
			:hover {
				1px solid ${stylingConstants.colors.sActiveInputHighlightColor}
			}
		`;
	}

	let showSettingsFlyout = false;
	const toggleSettingsFlyout = () => {
		showSettingsFlyout = !showSettingsFlyout;
	}

	const startEditingMode = () => {
		showSettingsFlyout = false;
		uiState.update((currentValue) => {
			currentValue.sPersonIdForNodeEdit = sPersonId;
			return currentValue;
		});
	};

	const endEditingMode = () => {
		uiState.update((currentValue) => {
			currentValue.sPersonIdForNodeEdit = undefined;
			return currentValue;
		});
	};

	const deletePerson = () => {
		// todo
	}
</script>

<div id="node-settings-button-container" class="node-settings-button-container">
	<button
		type="button"
		id="settings-button"
		class="{nodeSettingsButtonDynamicClass} node-settings-button"
		on:click|stopPropagation={bIsNodeInEditMode ? endEditingMode : toggleSettingsFlyout}
		>{buttonText}</button
	>

	{#if showSettingsFlyout}
		<div id='node-settings-flyout-menu' class="node-settings-flyout-menu">
			<ul>
				<li><a on:click|stopPropagation={startEditingMode}>Edit</a></li>
				<li><a on:click|stopPropagation={deletePerson}>Remove</a></li>
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
		background-color: lightgreen;
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

	.node-settings-flyout-menu a:hover {
		background-color: #ccc;
	}
</style>
