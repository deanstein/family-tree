<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../stylingConstants';

	const personNodeOverlayDynamicClass = css`
		z-index: ${stylingConstants.zIndices.nPersonNodeOverlayZIndex};
		background-color: ${stylingConstants.colors.overlayColor};
		opacity: ${stylingConstants.colors.overlayOpacity};
	`;
</script>

<div id="person-node-overlay" class="{personNodeOverlayDynamicClass} person-node-overlay" />

<style>
	.person-node-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
	}
</style>
