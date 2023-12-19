<script>
	import { css } from '@emotion/css';

	import stylingConstants from '$lib/components/styling-constants';

	export let isEnabled = true;
	export let inputValue = new Date().toISOString().substr(0, 10);
	export let onKeyUpFunction = undefined;

	function handleDateChange(event) {
		inputValue = event.target.value;
	}

	let datePickerDynamicClass = css`
		font-size: ${stylingConstants.sizes.bioFieldFontSize};
		color: ${stylingConstants.colors.textColor};
		border: 2px solid ${stylingConstants.colors.activeColor};
		:hover {
			border: 2px solid ${stylingConstants.colors.hoverColor};
		}
		:disabled {
			border-radius: ${stylingConstants.sizes.bioFieldBorderRadius};
		}
	`;
</script>

<div class="date-picker-container">
	<input
		type="date"
		disabled={!isEnabled}
		bind:value={inputValue}
		on:input={handleDateChange}
		on:keyup={onKeyUpFunction}
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
		padding: 4px;
		font-family: sans-serif;
	}

	input:disabled {
		background-color: white;
		border: 2px solid transparent;
	}
</style>
