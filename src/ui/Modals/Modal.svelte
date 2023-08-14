<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../styling-constants';
	import Portal from 'svelte-portal';
	import Overlay from './Overlay.svelte';

	export let showModal = true;
    export let showCloseButton = false;
	export let modalTitle;
	export let modalWidth;
	export let modalHeight;
	export let zIndex;

	const modalContentContainerDynamicClass = css`
        width: ${modalWidth};
		height: ${modalHeight};
		z-index: ${zIndex};
        background-color: ${stylingConstants.colors.modalContentContainerColor};
	`;
</script>

{#if showModal}
	<div id="modal-outer-container" class="modal-outer-container">
		<div id="modal-content-container" class="{modalContentContainerDynamicClass} modal-content-container">
			{#if modalTitle}
				<div id="modal-title-container">
					<div id="modal-title" class="modal-title">
						{modalTitle}
					</div>
				</div>
			{/if}
			{#if showCloseButton}
				<div id="choose-tree-close-button" class="choose-tree-close-button" />
			{/if}
			<div id="modal-content-slot" class="modal-content-slot">
				<slot name="modal-content-slot"/>
			</div>
			<div id="modal-toolbar-slot" class="modal-toolbar-slot" >
                <slot name="modal-toolbar-slot"/>
                </div>
		</div>
		<Portal target="#app-container">
			<Overlay />
		</Portal>
	</div>
{/if}

<style>
	.modal-outer-container {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100%;
	}

	.modal-content-container {
		position: absolute;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		border-radius: 10px;
	}

	.modal-title {
		display: flex;
		flex-direction: column;
		font-size: 5vh;
		justify-content: center;
		text-align: center;
		padding: 10px;
		color: white;
	}

	.modal-content-slot {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1vh;
		padding: 1vw;
		flex-grow: 1;
		width: -webkit-fill-available;
		width: -moz-available;
	}
</style>
