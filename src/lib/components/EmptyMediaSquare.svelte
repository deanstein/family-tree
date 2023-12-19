<script>
	import { css } from '@emotion/css';

	import stylingConstants from '$lib/components/styling-constants';

	let squareContainerCss = css`
		width: ${stylingConstants.sizes.personNodeSize};
		height: ${stylingConstants.sizes.personNodeSize};
		font-size: ${stylingConstants.sizes.personNodeFontSize};
		background-color: rgb(200, 200, 200, 0.4);
		border-radius: ${stylingConstants.sizes.bioFieldBorderRadius};
	`;
</script>

<div class="{squareContainerCss} square-container">Nothing to show.</div>

<style>
	.square-container {
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid transparent;
	}
</style>
