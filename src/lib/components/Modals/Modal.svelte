<script>
	import { css } from '@emotion/css';
	import Portal from 'svelte-portal';

	import { isMobileBreakpoint } from 'jdg-ui-svelte/states/ui-state.js';

	import { adjustRgbaColorTransparency } from '$lib/ui-management';

	import { drawCrossfade } from '$lib/components/graphics-factory';
	import stylingConstants from '$lib/components/styling-constants';

	import ButtonCircular from '../ButtonCircular.svelte';
	import Overlay from '$lib/components/Modals/Overlay.svelte';

	export let showModal = true;
	export let onClickCloseButton = undefined;
	export let title = 'This is a modal title';
	export let subtitle = 'This is a modal subtitle';
	export let width = 'auto';
	export let height = 'auto';
	export let maximizeOnMobile = true; // maximize size on mobile
	export let padding = '10px';
	export let overflow = ''; // default is not set but can be set per instance
	export let transparency = undefined; // default is in default bg color
	export let zIndex = undefined;

	const [send, receive] = drawCrossfade(stylingConstants.durations.transitionDuration);

	const modalOuterContainerCss = css`
		z-index: ${zIndex ?? ''};
	`;

	let modalContentContainerCss = css``;
	$: {
		modalContentContainerCss = css`
			width: ${$isMobileBreakpoint && maximizeOnMobile ? '90vw' : width};
			height: ${$isMobileBreakpoint && maximizeOnMobile ? '90svh' : height};
			overflow: ${overflow};
			z-index: ${zIndex ?? ''};
			background-color: ${transparency
				? adjustRgbaColorTransparency(stylingConstants.colors.modalContentBackground, transparency)
				: stylingConstants.colors.modalContentBackground};
		`;
	}

	const modalContentSlotCss = css`
		padding: ${padding};
	`;

	const modalTitleBarContainerCss = css`
		background-color: ${stylingConstants.colors.modalTitleBackground};
	`;

	const modalTitleCss = css`
		font-size: ${stylingConstants.sizes.modalTitleFontSize};
		color: ${stylingConstants.colors.textColor};
	`;

	const modalSubtitleCss = css`
		font-size: ${stylingConstants.sizes.modalSubtitleFontSize};
		color: ${stylingConstants.colors.textColor};
	`;
</script>

{#if showModal}
	<div
		in:receive={{ key: showModal }}
		out:send={{ key: showModal }}
		class="modal-outer-container {modalOuterContainerCss}"
	>
		<div class="modal-content-container {modalContentContainerCss}">
			{#if title || onClickCloseButton}
				<div class="modal-title-bar-container {modalTitleBarContainerCss}">
					<div class="modal-title-container">
						<div class="modal-title {modalTitleCss}">
							{title}
						</div>
						<div class="modal-title-bar-actions-container">
							{#if onClickCloseButton}
								<ButtonCircular
									faIcon={'fa-xmark'}
									iconColor={stylingConstants.colors.activeColor}
									backgroundColor={'transparent'}
									onClickFunction={onClickCloseButton ?? (() => {})}
								/>
							{/if}
						</div>
					</div>
					{#if subtitle}
						<div class="modal-subtitle-container">
							<div class="modal-subtitle {modalSubtitleCss}">
								{subtitle}
							</div>
						</div>
					{/if}
				</div>
			{/if}
			<div class="modal-content-slot {modalContentSlotCss}">
				<slot name="modal-content-slot" />
			</div>
			<div class="modal-toolbar-slot">
				<slot name="modal-toolbar-slot" />
			</div>
		</div>
		<Portal target="#app-container">
			<Overlay zIndexOverride={zIndex ? zIndex - 1 : undefined} />
		</Portal>
	</div>
{/if}

<style>
	.modal-outer-container {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100svh;
		width: 100%;
		/* backdrop-filter: blur(5px); */
	}

	.modal-content-container {
		position: absolute;
		display: flex;
		flex-direction: column;
		align-items: center;
		border-radius: 10px;
	}

	.modal-title-bar-container {
		width: -webkit-fill-available;
		width: -moz-available;
		border-radius: 10px 10px 0px 0px;
	}

	.modal-title-bar-actions-container {
		position: absolute;
		display: flex;
		justify-content: right;
		align-items: center;
		padding: 0px 5px 0px 5px;
		width: -webkit-fill-available;
		width: -moz-available;
	}

	.modal-title-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.modal-title {
		text-align: center;
		width: 100%;
		font-weight: bold;
		padding: 7px 20px 5px 20px;
		box-sizing: border-box;
	}

	.modal-subtitle-container {
		width: 100%;
	}

	.modal-subtitle {
		width: 100%;
		text-align: center;
		padding: 0px 20px 5px 20px;
		box-sizing: border-box;
	}

	.modal-content-slot {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1vh;
		flex-grow: 1;
		width: -webkit-fill-available;
		width: -moz-available;
		height: -webkit-fill-available;
		height: -moz-available;
		min-height: 0;
	}

	.modal-toolbar-slot {
		display: flex;
		width: -webkit-fill-available;
		width: -moz-available;
		justify-content: right;
	}
</style>
