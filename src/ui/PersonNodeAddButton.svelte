<script>
	import { css } from '@emotion/css';
	import stylingConstants from '../stores/stylingConstants';

	const personNodeAddButtonDynamicStyle = css`
        width: ${stylingConstants.sizes.personNodeAddButtonSize};
		height: ${stylingConstants.sizes.personNodeAddButtonSize};
		-moz-border-radius: ${stylingConstants.sizes.personNodeAddButtonRadius};
		-webkit-border-radius: ${stylingConstants.sizes.personNodeAddButtonRadius};
		border-radius: ${stylingConstants.sizes.personNodeAddButtonRadius};
	`;
</script>

<div
	id="person-add-button-container"
	class="person-add-button-container"
>
	<div id="person-add-button" class="{personNodeAddButtonDynamicStyle} person-add-button">
		<div id="person-add-button-label" class="person-add-button-label">+</div>
	</div>
</div>

<style>
    .person-add-button-container {
        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }

	.person-add-button {
		display: flex;
		align-items: center;
		justify-content: center;
		background: darkgray;
		border: 2px dashed black;
	}

	.person-add-button-label {
		font-size: 2em;
	}
</style>
