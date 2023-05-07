<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../../styling-constants';

	export let showLabel = true;
	export let label = 'Checkbox label';
	export let isChecked;

	let checkboxDynamicClass = css`
		font-size: ${stylingConstants.sizes.bioFieldFontSize};
	`;
</script>

<div id="checkbox-wrapper" class="checkbox-wrapper">
	<input type="checkbox" bind:checked={isChecked} class="checkbox" />
	{#if showLabel}
		<div id="checkbox-label" class={checkboxDynamicClass}>
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
</style>
