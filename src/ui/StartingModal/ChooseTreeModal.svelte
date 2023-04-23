<script>
	import { css } from '@emotion/css';
	import Portal from 'svelte-portal';

	import Overlay from '../NodeView/Overlay.svelte';

	import uiState from '../../stores/uiState';
	import stylingConstants from '../stylingConstants';

	import { chooseTreeStrings } from '../strings';

	import ChooseTreeOption from './ChooseTreeOption.svelte';

	import { getRepoFamilyTreeAndSetActive, hideChooseTreeModal } from '../../logic/uiManagement';

	export let showCloseButton = true;

	const chooseTreeModalContentContainerDynamicClass = css`
		z-index: ${stylingConstants.zIndices.nPersonNodeEditZIndex + 1};
	`;

	const newFamilyTreeButtonOnClick = () => {
		// new family tree is already loaded, so just dismiss the choose tree modal
		hideChooseTreeModal();
	};

	const exampleFamilyTreeButtonOnClick = () => {
		// hide the modal
		hideChooseTreeModal();
		// load the Roy family tree
		getRepoFamilyTreeAndSetActive('0', '8890');
	};

	const loadFamilyTreeButtonOnClick = () => {
		// hide the modal
		hideChooseTreeModal();
		// load the family tree
		// TODO: add ability to choose, rather than hard-code
		getRepoFamilyTreeAndSetActive('1', '8890');
	};
</script>

{#if $uiState.showChooseTreeModal}
	<div id="choose-tree-modal-outer-container" class="choose-tree-modal-outer-container">
		<div
			id="choose-tree-modal-content-container"
			class="{chooseTreeModalContentContainerDynamicClass} choose-tree-modal-content-container"
		>
			{#if showCloseButton}
				<div id="choose-tree-close-button" class="choose-tree-close-button" />
			{/if}
			<div id="choose-tree-header" class="choose-tree-header">
				<div id="welcome-message" class="choose-tree-welcome-message">Choose a family tree:</div>
			</div>
			<div id="choose-tree-options-grid" class="choose-tree-options-grid">
				<ChooseTreeOption
					buttonText={chooseTreeStrings.newTreeButton}
					buttonFunction={newFamilyTreeButtonOnClick}
					description={chooseTreeStrings.newTreeDescription}
				/>
				<ChooseTreeOption
					buttonText={chooseTreeStrings.exampleTreeButton}
					buttonFunction={exampleFamilyTreeButtonOnClick}
					description={chooseTreeStrings.exampleTreeDescription}
				/>
				<ChooseTreeOption
					buttonText={chooseTreeStrings.loadTreeButton}
					buttonFunction={loadFamilyTreeButtonOnClick}
					description={chooseTreeStrings.loadTreeDescription}
				/>
			</div>
			<div id="dev-message" class="choose-tree-dev-message">
				Note: This app is unfinished and does not represent the final interface, colors, or
				features. It may also be buggy.
			</div>
		</div>
		<Portal target={document.body}>
			<Overlay />
		</Portal>
	</div>
{/if}

<style>
	.choose-tree-modal-outer-container {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100vw;
	}

	.choose-tree-modal-content-container {
		display: flex;
		flex-direction: column;
		width: 50vw;
		height: 50vh;
		background-color: rgba(48, 48, 48, 0.8);
	}

	.choose-tree-header {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 10px;
		color: white;
	}

	.choose-tree-welcome-message {
		font-size: 5vh;
		display: flex;
		justify-content: center;
		padding: 10px;
		color: white;
	}

	.choose-tree-dev-message {
		display: flex;
		padding: 10px;
		font-style: italic;
		justify-content: center;
		color: #ebf596;
	}

	.choose-tree-options-grid {
		display: flex;
		flex-grow: 1;
		gap: 5vh;
		padding: 5vh;
	}
</style>
