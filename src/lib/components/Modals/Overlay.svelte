<script>
	import { css } from '@emotion/css';
	import { fade } from 'svelte/transition';

	import stylingConstants from '$lib/components/styling-constants';

	export let zIndexOverride = undefined;

	const overlayCss = css`
		z-index: ${zIndexOverride ? zIndexOverride : stylingConstants.zIndices.personNodeOverlayZIndex};
		background-color: ${stylingConstants.colors.overlayColor};
		opacity: ${stylingConstants.colors.overlayOpacity};
	`;
</script>

<div
	transition:fade={{ duration: stylingConstants.durations.transitionDuration }}
	class="overlay {overlayCss}"
/>

<style>
	.overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}
</style>
