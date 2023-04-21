<script>
	import { css } from '@emotion/css';

	export let message = 'This is a notification banner.';
	export let color = 'lightGreen';
	export let showCloseButton = true;

	let headerContainerDynamicClass;

	$: {
		headerContainerDynamicClass = css`
			background-color: ${color};
		`;
	}
</script>

<div
	id="notification-banner-outer-container"
	class="notification-banner-outer-container {headerContainerDynamicClass}"
>
	{message}
</div>

<style>
	.notification-banner-outer-container {
		z-index: 1;
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
