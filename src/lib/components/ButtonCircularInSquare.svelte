<script>
	import { css } from '@emotion/css';

	import { JDGButton } from 'jdg-ui-svelte';

	import stylingConstants from '$lib/components/styling-constants';

	export let enabled = true;
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
	`;

	$: {
		squareContainerCss = css`
			${squareContainerCss}
			cursor: ${enabled ? 'pointer' : 'default'};
			border: ${enabled
				? `2px solid ${stylingConstants.colors.buttonColorPrimary}`
				: `2px solid transparent`};
			:hover {
				border: ${enabled
					? `2px solid ${stylingConstants.colors.hoverColor}`
					: `2px solid transparent`};
			}
		`;
	}
</script>

<div
	class="square-container {squareContainerCss}"
	on:click={enabled ? onClickFunction : () => {}}
	on:keypress={enabled ? onClickFunction : () => {}}
	on:mouseover={onHoverFunction}
	on:focus={onHoverFunction}
	on:mouseleave={onBlurFunction}
	role="button"
	tabindex="0"
>
	<JDGButton
		{onClickFunction}
		faIcon="fa-plus fa-fw"
		isEnabled={enabled}
		label={null}
		doForceSquareRatio
		paddingLeftRight="4px"
		paddingTopBottom="4px"
		fontSize="1rem"
		backgroundColor={isHovering
			? stylingConstants.colors.hoverColor
			: stylingConstants.colors.buttonColorPrimary}
		backgroundColorHover={enabled ? stylingConstants.colors.hoverColor : 'transparent'}
	/>
</div>

<style>
	.square-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
