<script>
	import { css } from '@emotion/css';

	import stylingConstants from './styling-constants';

	import AddButtonCircular from './AddButtonCircular.svelte';

	export let onClickFunction = () => {};
	let isHovering = false;

	const onHoverFunction = () => {
		isHovering = true;
	};
	const onBlurFunction = () => {
		isHovering = false;
	};

	let squareContainerCss = css`
		width: ${stylingConstants.sizes.personNodeSize};
		height: ${stylingConstants.sizes.personNodeSize};
		background-color: rgb(200, 200, 200, 0.4);
		border-radius: ${stylingConstants.sizes.bioFieldBorderRadius};

		&:hover {
			border: 2px solid ${stylingConstants.colors.hoverColor};
		}
	`;
</script>

<div
	id="square-container"
	class="{squareContainerCss} square-container"
	on:click={onClickFunction}
	on:keypress={onClickFunction}
	on:mouseover={onHoverFunction}
	on:focus={onHoverFunction}
	on:mouseleave={onBlurFunction}
>
	<AddButtonCircular
		{onClickFunction}
		colorOverride={isHovering ? stylingConstants.colors.hoverColor : undefined}
	/>
</div>

<style>
	.square-container {
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid transparent;
		cursor: pointer;
	}
</style>
