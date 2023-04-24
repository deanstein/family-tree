<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../stylingConstants';

	export let message = 'This is a notification banner.';
	export let color = 'lightGreen';
	export let showCloseButton = true;

	let headerContainerDynamicClass;

	$: {
		headerContainerDynamicClass = css`
			z-index: ${stylingConstants.zIndices.nPersonNodeEditZIndex};
			background-color: ${color};
		`;
	}
</script>

<div
	id="notification-banner-outer-container"
	class="notification-banner-outer-container {headerContainerDynamicClass}"
>
	{message}
	<slot />
</div>

<style>
	.notification-banner-outer-container {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;

		height: 5vh;
		width: 100%;
		width: -moz-available; /* WebKit-based browsers will ignore this. */
		width: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
	}
</style>
