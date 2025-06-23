<script>
	import { css } from '@emotion/css';

	export let faIcon = undefined;
	export let message = 'Nothing to show.';
	export let tooltip = undefined;

	import stylingConstants from '$lib/components/styling-constants';

	let squareContainerCss = css`
		width: ${stylingConstants.sizes.personNodeSize};
		height: ${stylingConstants.sizes.personNodeSize};
		color: ${stylingConstants.colors.textColorLight};
		font-size: ${stylingConstants.sizes.personNodeFontSize};
		background-color: rgb(200, 200, 200, 0.4);
		border-radius: ${stylingConstants.sizes.bioFieldBorderRadius};
	`;
</script>

<div class="square-container {squareContainerCss}" title={tooltip ?? ''}>
	{#if faIcon}
		<div class="icon">
			<i class="fa-solid {faIcon}" />
		</div>
	{/if}
	{message}
</div>

<style>
	.square-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 5px;
		box-sizing: border-box;
		text-align: center;
		border: 2px solid transparent;
	}

	.icon {
		font-size: 1rem;
	}
</style>
