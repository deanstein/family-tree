<script>
	import { css } from '@emotion/css';

	import stylingConstants from '$lib/components/styling-constants';

	export let relationshipName;

	const relationshipLabelContainerCss = css`
		margin-bottom: ${stylingConstants.sizes.padding};
		padding-left: ${stylingConstants.sizes.padding};
		padding-right: ${stylingConstants.sizes.padding};
	`;

	const relationshipLabelCss = css`
		color: ${stylingConstants.colors.textColor};
		border: 2px solid ${stylingConstants.colors.activeColor};
		font-size: ${stylingConstants.sizes.personNodeFontSize};
	`;
</script>

<div class="relationship-label-container {relationshipLabelContainerCss}">
	<div class="relationship-label {relationshipLabelCss}">
		{relationshipName}
	</div>
</div>

<style>
	.relationship-label-container {
		width: -webkit-fill-available;
		width: -moz-available;
	}

	.relationship-label {
		font-style: italic;
		outline: none;
		-webkit-appearance: none; /* for webkit-based browsers */
		-moz-appearance: none; /* for Firefox */
		text-align: center;
		appearance: none;
		border: 2px solid transparent;
		font-style: italic;
		background-color: rgb(241, 241, 241);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		width: -webkit-fill-available;
		width: -moz-available;
		border-radius: 5px;
	}
</style>
