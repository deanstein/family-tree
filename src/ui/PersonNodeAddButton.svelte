<script>
	import { css } from '@emotion/css';
	import stylingConstants from '../stores/stylingConstants';

	let personNodeAddButtonContainerDynamicStyle = css`
		width: ${stylingConstants.sizes.personNodeAddButtonSize};
		height: ${stylingConstants.sizes.personNodeAddButtonSize};
	`;
	const personNodeAddButtonDynamicStyle = css`
		-moz-border-radius: ${stylingConstants.sizes.personNodeAddButtonRadius};
		-webkit-border-radius: ${stylingConstants.sizes.personNodeAddButtonRadius};
		border-radius: ${stylingConstants.sizes.personNodeAddButtonRadius};
	`;
</script>

<div
	id="person-add-button-container"
	class="{personNodeAddButtonContainerDynamicStyle} person-add-container"
>
	<div id="person-add-button" class="{personNodeAddButtonDynamicStyle} person-add-button">
		<div id="person-add-button-label" class="person-add-button-label">+</div>
	</div>
</div>

<style>
	.person-add-button {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
		background: darkgray;
		border: 2px dashed black;
	}

	.person-add-button-label {
		font-size: 2em;
	}
</style>
