<script>
	import { css } from '@emotion/css';

	import stylingConstants from '$lib/components/styling-constants';

	export let onClickFunction = undefined;
	export let faIcon = 'fa-ellipsis';

	let actionsButtonCss;

	const iconCss = css`
		color: ${stylingConstants.colors.textColorLight};
	`;

	$: {
		actionsButtonCss = css`
			z-index: ${stylingConstants.zIndices.personNodeOverlayZIndex};
			border: 2px solid transparent;
			font-size: ${stylingConstants.sizes.personNodeFontSize};
			:hover {
				background-color: ${stylingConstants.colors.hoverColor};
			}
		`;
	}
</script>

<div class="node-actions-button-container">
	<button
		type="button"
		class="node-actions-button {actionsButtonCss}"
		on:click|stopPropagation={onClickFunction}
	>
		<i title="Edit relationship" class="fa-solid {faIcon} {iconCss}" />
	</button>
</div>

<style>
	.node-actions-button-container {
		width: 100%;
		float: right;
	}

	.node-actions-button {
		position: absolute;
		top: 0px;
		right: 0px;
		border: none;
		letter-spacing: 2px;
		padding-left: 0.5rem;
		padding-right: 0.5rem;
		color: black;
		background-color: transparent;
		font-weight: bold;
		border-radius: 5px;
		cursor: pointer;
	}
</style>
