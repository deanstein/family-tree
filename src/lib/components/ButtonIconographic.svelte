<script>
	import { css } from '@emotion/css';
	import stylingConstants from './styling-constants';

	export let onClickFunction;
	export let altText = '';
	export let iconSrc = './img/family-tree-icon.png';
	export let height = 'auto';
	export let padding = '10px';
	export let backgroundColor = 'transparent';
	export let backgroundColorHover = stylingConstants.colors.activeColorSubtle;

	const buttonCss = css`
		height: ${height};
		padding: ${padding};
		background-color: ${backgroundColor};
		:hover {
			background-color: ${backgroundColorHover};
		}
		:disabled {
			background-color: ${stylingConstants.colors.buttonColorDisabled};
		}
		:disabled:hover {
			background-color: ${stylingConstants.colors.buttonColorDisabled};
		}
	`;
</script>

<button class="icon-button-wrapper" on:click={onClickFunction} type="button">
	<img class={buttonCss} src={iconSrc} alt={altText} title={altText} />
</button>

<style>
	.icon-button-wrapper {
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		border: none;
		background: transparent;
		padding: 0;
	}
</style>
