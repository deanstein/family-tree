<script>
	import { css } from '@emotion/css';

	import stylingConstants from '$lib/components/styling-constants';

	import ButtonCircular from '$lib/components/ButtonCircular.svelte';

	export let onClickFunction = () => {};
	export let colorOverride = undefined;

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
	`;

	$: {
		squareContainerCss = css`
			${squareContainerCss}
			border: ${isHovering
				? `2px solid ${stylingConstants.colors.hoverColor}`
				: '2px solid transparent'};
		`;
	}
</script>

<div
	class="{squareContainerCss} square-container"
	on:click={onClickFunction}
	on:keypress={onClickFunction}
	on:mouseover={onHoverFunction}
	on:focus={onHoverFunction}
	on:mouseleave={onBlurFunction}
>
	<ButtonCircular
		{onClickFunction}
		colorOverride={isHovering ? stylingConstants.colors.hoverColor : colorOverride}
	/>
</div>

<style>
	.square-container {
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
</style>
