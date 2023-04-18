<script>
	import { css } from '@emotion/css';

	import Overlay from './NodeView/Overlay.svelte';

	import uiState from '../stores/uiState';
	import stylingConstants from './stylingConstants';

	const chooseTreeModalContentContainerDynamicClass = css`
		z-index: ${stylingConstants.zIndices.nPersonNodeEditZIndex + 1};
	`;
</script>

{#if $uiState.showChooseTreeModal}
	<div id="choose-tree-modal-outer-container" class="choose-tree-modal-outer-container">
		<div
			id="choose-tree-modal-content-container"
			class="{chooseTreeModalContentContainerDynamicClass} choose-tree-modal-content-container"
		>
			<div id="choose-tree-header" class="choose-tree-header">Welcome! Choose a family tree:</div>
			<div id="choose-tree-options-grid" class="choose-tree-options-grid">
				<div id="new-tree-cell-container" class="options-cell-container">New Family Tree</div>
				<div id="example-tree-cell-container" class="options-cell-container">
					Example Family Tree
				</div>
				<div id="load-tree-cell-container" class="options-cell-container">Load Family Tree</div>
			</div>
		</div>
		<Overlay />
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
		width: 50vw;
		height: 50vh;
		background-color: black;
	}

	.choose-tree-header {
		display: flex;
		justify-content: center;
		background-color: gray;
	}

	.choose-tree-options-grid {
		display: flex;
		height: 100%;
	}

	.options-cell-container {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-basis: 33%;
		color: white;
	}
</style>
