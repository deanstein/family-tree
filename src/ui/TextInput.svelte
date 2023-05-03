<script>
	import { css } from '@emotion/css';

	import stylingConstants from './styling-constants';

	const textInputDynamicClass = css`
        border: 2px solid ${stylingConstants.colors.activeColor};
        :hover {
            border: 2px solid ${stylingConstants.colors.hoverColor};
            `;
</script>

<input type="text" class={textInputDynamicClass} />

<style>
	input {
		width: 100%;
	}
</style>
