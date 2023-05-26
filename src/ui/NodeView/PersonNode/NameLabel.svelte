<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../../styling-constants';

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
		color: ${stylingConstants.colors.textColor};
	`;
</script>

<div id="name-input-container" class="{nameLabelContainerDynamicClass} name-input-container">
	<div id="name-input" class="{nameLabelDynamicClass} name-input">
		{sInputValue}
	</div>
</div>

<style>
	.name-input-container {
		display: flex;
		width: -moz-available; /* WebKit-based browsers will ignore this. */
		width: -webkit-fill-available; /* Mozilla-based browsers will ignore this. */
	}

	.name-input {
		width: 100%;
		text-align: center;
		outline: none;
		background-color: white;
		border: 2px solid transparent;
	}
</style>
