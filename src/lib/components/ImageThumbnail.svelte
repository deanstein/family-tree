<script>
	import { css } from '@emotion/css';

	import {
		repoOwner,
		dataRepoName,
		imagePlaceholderSrc
	} from '$lib/persistence-management';

	import stylingConstants from '$lib/components/styling-constants';

	import ImageAsyncFromUrl from '$lib/components/ImageAsyncFromUrl.svelte';

	export let imageContent;
	export let allowEdit = false;
	export let onClickFunction = () => {};

	const imageThumbnailContainerCss = css`
		height: ${stylingConstants.sizes.personNodeSize};
		border-radius: ${stylingConstants.sizes.bioFieldBorderRadius};
		:hover {
			border: 2px solid ${stylingConstants.colors.hoverColor};
		}
	`;
</script>

<div
	class="image-thumbnail-container {imageThumbnailContainerCss}"
	on:click|stopPropagation={onClickFunction}
	on:keypress|stopPropagation={onClickFunction}
>
	<ImageAsyncFromUrl
		{repoOwner}
		repoName={dataRepoName}
		imageUrl={imageContent.url}
		{imagePlaceholderSrc}
		{allowEdit}
	/>
</div>

<style>
	.image-thumbnail-container {
		border: 2px solid transparent;
		overflow: hidden;
		cursor: pointer;
	}
</style>
