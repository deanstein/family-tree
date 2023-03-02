<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../../stores/stylingConstants';
	import { setActiveNodeEditId, unsetActiveNodeEditId } from '../../logic/uiManagement.js';

	export let sPersonId;
	export let bIsNodeInEditMode;

	const startEditingMode = () => {
		toggleSettingsFlyout();
		setActiveNodeEditId(sPersonId);
	}

	const endEditingMode = () => {
		unsetActiveNodeEditId();
	};

	let settingsButtonText;
	let nodeSettingsButtonText;
	$: {
		settingsButtonText = bIsNodeInEditMode ? 'done' : '...';

		nodeSettingsButtonText = css`
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

	const deletePerson = () => {
		// todo
	}
</script>

<div id="node-settings-button-container" class="node-settings-button-container">
	<button
		type="button"
		id="settings-button"
		class="{nodeSettingsButtonText} node-settings-button"
		on:click|stopPropagation={bIsNodeInEditMode ? endEditingMode : toggleSettingsFlyout}
		>{settingsButtonText}</button
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
