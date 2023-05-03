<script>
	import { css } from '@emotion/css';
	import stylingConstants from '../../styling-constants';

	let currentValue;

	let datePickerDynamicClass = css`
		border: 2px solid ${stylingConstants.colors.activeColor};
		:hover  {
			border: 2px solid ${stylingConstants.colors.hoverColor};
		}
	`;
</script>

<input type="date" bind:value={currentValue} class="{datePickerDynamicClass} date-picker" />

<style>
	.date-picker {
		width: 100%;
	}
</style>
