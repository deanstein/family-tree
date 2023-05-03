<script>
	import { css } from '@emotion/css';

	import stylingConstants from './styling-constants';

	const textInputDynamicClass = css`
        border: 2px solid ${stylingConstants.colors.activeColor};
        :hover {
            border: 2px solid ${stylingConstants.colors.hoverColor};
            `;
</script>

<div id="input-container" class="input-container">
	<input type="text" class={textInputDynamicClass} />
</div>

<style>
	.input-container {
		display: flex;
	}

	input {
		width: 100%;
		outline: none;
	}
</style>
