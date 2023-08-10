<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../styling-constants';

	export let zIndexOverride = undefined;

	const overlayDynamicClass = css`
		z-index: ${zIndexOverride ? zIndexOverride : stylingConstants.zIndices.personNodeOverlayZIndex};
		background-color: ${stylingConstants.colors.overlayColor};
		opacity: ${stylingConstants.colors.overlayOpacity};
	`;
</script>

<div id="overlay" class="{overlayDynamicClass} overlay" />

<style>
	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100vh;
	}
</style>
