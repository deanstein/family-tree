<script>
	import { css } from '@emotion/css';

	import relationshipMap from '../../../schemas/relationship-map';
	import stylingConstants from '../../styling-constants';

	export let sInputValue;
	export let bEnabled = false;
	export let compatibleGroups = JSON.parse(JSON.stringify(relationshipMap));

	const relationshipTypePickerContainerDynamicClass = css`
		width: -webkit-fill-available;
		width: -moz-available;
		margin-bottom: ${stylingConstants.sizes.padding};
		padding-left: ${stylingConstants.sizes.padding};
		padding-right: ${stylingConstants.sizes.padding};
	`;

	const relationshipTypePickerDynamicClass = css`
		border: 2px solid ${stylingConstants.colors.activeColor};
		font-size: ${stylingConstants.sizes.personNodeFontSize};
	`;
</script>

<div
	id="relationship-type-picker-container"
	class="{relationshipTypePickerContainerDynamicClass} relationship-type-picker-container"
>
	<select
		id="options"
		class="{relationshipTypePickerDynamicClass} relationship-type-picker"
		bind:value={sInputValue}
		disabled={!bEnabled}
	>
		{#each Object.entries(compatibleGroups) as [category, items]}
			<optgroup label={items.label}>
				{#each Object.entries(items) as [key, value]}
					{#if key != 'label'}
						{#if value.label}
							<option value={`${value.id}`}>{value.label}</option>
						{/if}
					{/if}
				{/each}
			</optgroup>
		{/each}
	</select>
</div>

<style>
	.relationship-type-picker {
		width: 100%;
		font-style: italic;
		outline: none;
	}
	.relationship-type-picker:disabled {
		-webkit-appearance: none; /* for webkit-based browsers */
		-moz-appearance: none; /* for Firefox */
		text-align: center;
		appearance: none;
		border: 2px solid transparent;
		font-style: italic;
	}
</style>
