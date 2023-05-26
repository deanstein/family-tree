<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../../styling-constants';

	export let relationshipName;

	const relationshipLabelContainerDynamicClass = css`
		margin-bottom: ${stylingConstants.sizes.padding};
		padding-left: ${stylingConstants.sizes.padding};
		padding-right: ${stylingConstants.sizes.padding};
	`;

	const relationshipLabelDynamicClass = css`
		color: ${stylingConstants.colors.textColor};
		border: 2px solid ${stylingConstants.colors.activeColor};
		font-size: ${stylingConstants.sizes.personNodeFontSize};
	`;
</script>

<div
	id="relationship-type-picker-container"
	class="{relationshipLabelContainerDynamicClass} relationship-type-picker-container"
>
	<div id="options" class="{relationshipLabelDynamicClass} relationship-type-picker">
		{relationshipName}
	</div>
</div>

<style>
	.relationship-type-picker-container {
		width: -webkit-fill-available;
		width: -moz-available;
	}

	.relationship-type-picker {
		font-style: italic;
		outline: none;
		-webkit-appearance: none; /* for webkit-based browsers */
		-moz-appearance: none; /* for Firefox */
		text-align: center;
		appearance: none;
		border: 2px solid transparent;
		font-style: italic;
		background-color: rgb(241, 241, 241);
	}
</style>
