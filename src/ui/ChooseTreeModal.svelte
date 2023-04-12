<script>
	import { css } from '@emotion/css';

	import Overlay from './NodeView/Overlay.svelte';

	import uiState from '../stores/uiState';
	import stylingConstants from './stylingConstants';

	const chooseTreeModalContentContainerDynamicClass = css`
		z-index: ${stylingConstants.zIndices.nPersonNodeEditZIndex};
	`;
</script>

{#if $uiState.showChooseTreeModal}
	<div
		id="choose-tree-modal-outer-container"
		class="{chooseTreeModalContentContainerDynamicClass} choose-tree-modal-outer-container"
	>
		<div id="choose-tree-modal-content-container" class="choose-tree-modal-content-container" />
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
		width: 10vh;
		height: 10vh;
		background-color: black;
	}
</style>
