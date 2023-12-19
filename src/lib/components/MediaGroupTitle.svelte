<script>
	import { css } from '@emotion/css';

	import stylingConstants from '$lib/components/styling-constants';

	export let groupTitle = 'Group title';

	const personNodeGroupTitleCss = css`
		font-size: ${stylingConstants.sizes.personNodeGroupFontSize};
		height: ${stylingConstants.sizes.personNodeGroupTitleHeight};
		background-color: ${stylingConstants.colors.nodeGroupHeaderColor};
	`;
</script>

<div class="media-group-title {personNodeGroupTitleCss}">
	{groupTitle}
</div>

<style>
	.media-group-title {
		align-items: center;
		justify-content: center;
		display: inline-flex;
		width: 100%;
		color: white;
		border-radius: 5px;
	}
</style>
