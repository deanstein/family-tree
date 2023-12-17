<script>
	import { css } from '@emotion/css';

	import stylingConstants from '$lib/components/styling-constants';

	export let bIsActivePerson = false;
	export let sInputValue;

	const nameLabelContainerDynamicClass = css`
		padding-top: ${stylingConstants.sizes.padding};
		padding-left: ${stylingConstants.sizes.padding};
		padding-right: ${stylingConstants.sizes.padding};
		padding-bottom: ${bIsActivePerson ? stylingConstants.sizes.padding : '0px'};
	`;

	const nameLabelDynamicClass = css`
		font-size: ${stylingConstants.sizes.personNodeFontSize};
		border: 2px solid ${stylingConstants.colors.activeColor};
		color: white;
	`;
</script>

<div id="name-label-container" class="{nameLabelContainerDynamicClass} name-label-container">
	<div id="name-label" class="{nameLabelDynamicClass} name-label">
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
