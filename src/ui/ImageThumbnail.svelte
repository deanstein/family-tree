<script>
	import { css } from '@emotion/css';

	import { repoOwner, dataRepoName, tempPw } from '../logic/persistence-management';

	import stylingConstants from './styling-constants';

	import ImageAsyncFromUrl from './ImageAsyncFromUrl.svelte';

	export let imageContent;

	const imagePlaceholderSrc = './img/image-placeholder.jpg';

	const imageThumbnailContainerCss = css`
		height: ${stylingConstants.sizes.personNodeSize};
		border-radius: ${stylingConstants.sizes.bioFieldBorderRadius};
		:hover {
			border: 2px solid ${stylingConstants.colors.hoverColor};
		}
	`;
</script>

<div class="{imageThumbnailContainerCss} image-thumbnail-container">
	<ImageAsyncFromUrl
		{repoOwner}
		repoName={dataRepoName}
		password={tempPw}
		imageUrl={imageContent.url}
		{imagePlaceholderSrc}
		allowEdit={false}
	/>
</div>

<style>
	.image-thumbnail-container {
		border: 2px solid transparent;
		overflow: hidden;
	}
</style>
