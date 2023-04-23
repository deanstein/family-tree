<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../../stylingConstants';

	const avatarContainerDynamicClass = css`
		margin-top: ${stylingConstants.sizes.padding};
	`;
</script>

<div id="avatar-container" class="{avatarContainerDynamicClass} avatar-container">
	<img
		src="./img/avatar-placeholder.jpg"
		id="avatar-image"
		class="avatar-image"
		alt="avatar of this person"
	/>
</div>

<style>
	.avatar-container {
		height: 100%;
		overflow: hidden;
		aspect-ratio: 1;
		border-radius: 50%;
		background-color: lightgray;
	}

	.avatar-image {
		height: 100%;
		scale: 1.1; /* temporarily account for placeholder avatar */
	}
</style>
