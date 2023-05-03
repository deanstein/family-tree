<script>
	import { css } from '@emotion/css';
	import stylingConstants from '../../styling-constants';

	let currentValue;

	let datePickerDynamicClass = css`
		border: 2px solid ${stylingConstants.colors.activeColor};
		:hover {
			border: 2px solid ${stylingConstants.colors.hoverColor};
		}
	`;
</script>

<div id="date-picker-container" class="date-picker-container">
	<input type="date" bind:value={currentValue} class="{datePickerDynamicClass} date-picker" />
</div>

<style>
	.date-picker-container {
		display: flex;
	}

	.date-picker {
		width: 100%;
		outline: none;
	}
</style>
