<script>
	import { css } from '@emotion/css';

	import stylingConstants from '$lib/components/styling-constants';

	export let message = 'This is a notification banner.'; // default message
	export let color = 'lightGreen'; // default color
	export let standalone = true; // set to false if included in a header already in a fixed position
	// TODO: export let showCloseButton = true;

	let headerContainerDynamicClass;

	$: {
		headerContainerDynamicClass = css`
			z-index: ${stylingConstants.zIndices.notificationZIndex};
			background-color: ${color};
			position: ${standalone ? 'fixed' : 'relative'};
		`;
	}
</script>

<div
	class="notification-banner-outer-container {headerContainerDynamicClass}"
>
	{message}
	<div class="notification-button-container">
		<slot />
	</div>
</div>

<style>
	.notification-banner-outer-container {
		display: flex;
		justify-content: center;
		align-items: center;
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
