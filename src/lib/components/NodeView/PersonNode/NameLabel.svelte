<script>
	import { css } from '@emotion/css';

	import stylingConstants from '$lib/components/styling-constants';

	export let sInputValue;
	export let bIsActivePerson = undefined;
	export let paddingBottom = undefined;

	const nameLabelContainerCss = css`
		padding-top: ${stylingConstants.sizes.padding};
		padding-left: ${stylingConstants.sizes.padding};
		padding-right: ${stylingConstants.sizes.padding};
		padding-bottom: ${paddingBottom ?? stylingConstants.sizes.padding};
	`;

	const nameLabelCss = css`
		font-size: ${stylingConstants.sizes.personNodeFontSize};
		border: 2px solid ${stylingConstants.colors.activeColor};
		color: white;
	`;
</script>

<div class="name-label-container {nameLabelContainerCss}">
	<div class="name-label {nameLabelCss}">
		{bIsActivePerson ? sInputValue.toUpperCase() : sInputValue}
	</div>
</div>

<style>
	.name-label-container {
		display: flex;
		width: -moz-available; /* WebKit-based browsers will ignore this. */
		width: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
	}

	.name-label {
		color: white;
		width: 100%;
		text-align: center;
		font-weight: bold;
		outline: none;
		border: 2px solid transparent;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: -webkit-fill-available;
		width: -moz-available;
	}
</style>
