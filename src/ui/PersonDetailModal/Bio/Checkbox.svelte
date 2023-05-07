<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../../styling-constants';

	export let showLabel = true;
	export let label = 'Checkbox label';
	export let isChecked;
	export let isEnabled;

	let checkboxLabelDynamicClass = css`
		font-size: ${stylingConstants.sizes.bioFieldFontSize};
		color: ${stylingConstants.colors.textColor};
	`;
</script>

<div id="checkbox-wrapper" class="checkbox-wrapper">
	<input type="checkbox" bind:checked={isChecked} disabled={!isEnabled} class="checkbox" />
	{#if showLabel}
		<div id="checkbox-label" class={checkboxLabelDynamicClass}>
			{label}
		</div>
	{/if}
</div>

<style>
	.checkbox-wrapper {
		display: flex;
		align-items: center;
		gap: 0.1vw;
	}

	input {
		margin-left: 0;
	}
</style>
