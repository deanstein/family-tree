<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../../stylingConstants';

	const avatarContainerDynamicClass = css`
		margin-top: ${stylingConstants.sizes.padding};
	`;
</script>

<div id="avatar-container" class="{avatarContainerDynamicClass} avatar-container">
	<div id="avatar-image" class="avatar-image" />
</div>

<style>
	.avatar-container {
		height: 100%;
		aspect-ratio: 1;
		border-radius: 50%;
		background-color: lightgray;
	}
</style>
