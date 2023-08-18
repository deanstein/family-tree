<script>
	import { css } from '@emotion/css';
	import { fade, blur } from 'svelte/transition';
	import { drawCrossfade } from '../graphics-factory';
	const [send, receive] = drawCrossfade(stylingConstants.durations.transitionDuration);

	import stylingConstants from '../styling-constants';
	import Portal from 'svelte-portal';
	import Overlay from './Overlay.svelte';
	import { adjustRgbaColorTransparency } from '../../logic/ui-management';

	export let showModal = true;
	export let showCloseButton = false;
	export let title = 'This is a modal title';
	export let subtitle = 'This is a modal subtitle';
	export let width = 'auto';
	export let height = 'auto';
	export let padding = '10px';
	export let overflow = ''; // default is not set but can be set per instance
	export let transparency = undefined; // default is in default bg color
	export let zIndex;

	const modalOuterContainerDynamicClass = css`
		margin-top: ${stylingConstants.sizes.nHeaderHeight / 2 + 'vh'};
	`;

	const modalContentContainerDynamicClass = css`
		width: ${width};
		height: ${height};
		overflow: ${overflow};
		z-index: ${zIndex};
		background-color: ${transparency
			? adjustRgbaColorTransparency(stylingConstants.colors.modalContentBackground, transparency)
			: stylingConstants.colors.modalContentBackground};
	`;

	const modalContentSlotDynamicClass = css`
		padding: ${padding};
	`;

	const modalTitleDynamicClass = css`
		font-size: ${stylingConstants.sizes.modalTitleFontSize};
		color: ${stylingConstants.colors.textColor};
		background-color: ${stylingConstants.colors.modalTitleBackground};
	`;

	const modalSubtitleDynamicClass = css`
		font-size: ${stylingConstants.sizes.modalSubtitleFontSize};
		color: ${stylingConstants.colors.textColor};
		background-color: ${stylingConstants.colors.modalTitleBackground};
	`;
</script>

{#if showModal}
	<div
		in:receive={{ key: showModal }}
		out:send={{ key: showModal }}
		id="modal-outer-container"
		class="{modalOuterContainerDynamicClass} modal-outer-container"
	>
		<div
			id="modal-content-container"
			class="{modalContentContainerDynamicClass} modal-content-container"
		>
			{#if title}
				<div id="modal-title-container" class="modal-title-container">
					<div id="modal-title" class="{modalTitleDynamicClass} modal-title">
						{title}
					</div>
				</div>
			{/if}
			{#if subtitle}
				<div id="modal-subtitle-container" class="modal-subtitle-container">
					<div id="modal-subtitle" class="{modalSubtitleDynamicClass} modal-subtitle">
						{subtitle}
					</div>
				</div>
			{/if}
			{#if showCloseButton}
				<div id="choose-tree-close-button" class="choose-tree-close-button" />
			{/if}
			<div id="modal-content-slot" class="{modalContentSlotDynamicClass} modal-content-slot">
				<slot name="modal-content-slot" />
			</div>
			<div id="modal-toolbar-slot" class="modal-toolbar-slot">
				<slot name="modal-toolbar-slot" />
			</div>
		</div>
		<Portal target="#app-container">
			<Overlay zIndexOverride={zIndex - 1} />
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
		align-items: center;
		border-radius: 10px;
	}

	.modal-title-container {
		width: 100%;
	}

	.modal-title {
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
		font-weight: bold;
		padding: 7px 0px 5px 0px;
		border-radius: 10px 10px 0px 0px;
	}

	.modal-subtitle-container {
		width: 100%;
	}

	.modal-subtitle {
		width: 100%;
		padding-bottom: 5px;
		text-align: center;
	}

	.modal-content-slot {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 1vh;
		flex-grow: 1;
		width: -webkit-fill-available;
		width: -moz-available;
		height: -webkit-fill-available;
		height: -moz-available;
	}
</style>
