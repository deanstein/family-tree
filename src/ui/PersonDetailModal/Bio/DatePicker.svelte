<script>
	import { css } from '@emotion/css';
	import stylingConstants from '../../styling-constants';

	export let isEnabled = true;
	export let inputValue;

	let datePickerDynamicClass = css`
		border: 2px solid ${stylingConstants.colors.activeColor};
		:hover {
			border: 2px solid ${stylingConstants.colors.hoverColor};
		}
	`;
</script>

<div id="date-picker-container" class="date-picker-container">
	<input
		type="date"
		disabled={!isEnabled}
		bind:value={inputValue}
		class="{datePickerDynamicClass} date-picker"
	/>
</div>

<style>
	.date-picker-container {
		display: flex;
	}

	input {
		width: 100%;
		outline: none;
	}

	input:disabled {
		background-color: white;
		border: 2px solid transparent;
	}
</style>
