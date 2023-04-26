<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../styling-constants';

	export let message = 'This is a notification banner.';
	export let color = 'lightGreen';
	export let showCloseButton = true;

	let headerContainerDynamicClass;

	$: {
		headerContainerDynamicClass = css`
			z-index: ${stylingConstants.zIndices.notificationZIndex};
			background-color: ${color};
		`;
	}
</script>

<div
	id="notification-banner-outer-container"
	class="notification-banner-outer-container {headerContainerDynamicClass}"
>
	{message}
	<div id="notification-button-container" class="notification-button-container">
		<slot />
	</div>
</div>

<style>
	.notification-banner-outer-container {
		display: flex;
		justify-content: center;
		align-items: center;
		position: fixed;
		font-size: 1.5vh;
		height: 3vh;
		width: 100%;
		width: -moz-available; /* WebKit-based browsers will ignore this. */
		width: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
	}

	.notification-button-container {
		display: grid;
		margin-left: 0.75vw;
		gap: 0.75vw;
	}
</style>
