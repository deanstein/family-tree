<script>
	import { css } from '@emotion/css';

	import stylingConstants from './styling-constants';

	// required format: { optionGroup: {option: { value: "someValue", label: "Some Label" } } }
	export let optionValueKey = 'value';
	export let optionLabelKey = 'label';
	export let optionsGroupObject;
	export let enabled = true;

	let inputValue;

	const selectorContainerDynamicClass = css`
		width: -webkit-fill-available;
		width: -moz-available;
		margin-bottom: ${stylingConstants.sizes.padding};
	`;

	const selectorDynamicClass = css`
		border: 2px solid ${stylingConstants.colors.activeColor};
		:hover {
			border: 2px solid ${stylingConstants.colors.hoverColor};
		}
		font-size: ${stylingConstants.sizes.personNodeFontSize};
	`;
</script>

<div
	id="relationship-type-picker-container"
	class="{selectorContainerDynamicClass} relationship-type-picker-container"
>
	<select
		id="options"
		class="{selectorDynamicClass} relationship-type-picker"
		bind:value={inputValue}
		on:click|stopPropagation
		disabled={!enabled}
	>
		{#each Object.entries(optionsGroupObject) as [category, items]}
			{#if items.hasOwnProperty(optionLabelKey)}
				<optgroup label={items[optionLabelKey]}>
					{#each Object.entries(items) as [itemKey, itemValue]}
						{#if itemKey !== optionLabelKey && itemValue.hasOwnProperty(optionLabelKey)}
							<option value={itemValue[optionValueKey]}>{itemValue[optionLabelKey]}</option>
						{/if}
					{/each}
				</optgroup>
			{:else}
				{#each Object.entries(items) as [itemKey, itemValue]}
					{#if itemKey !== optionLabelKey && itemValue.hasOwnProperty(optionLabelKey)}
						<option value={itemValue[optionValueKey]}>{itemValue[optionLabelKey]}</option>
					{/if}
				{/each}
			{/if}
		{/each}
	</select>
</div>

<style>
	.relationship-type-picker {
		height: 1vw;
		width: 100%;
		outline: none;
	}
	.relationship-type-picker:disabled {
		-webkit-appearance: none; /* for webkit-based browsers */
		-moz-appearance: none; /* for Firefox */
		text-align: center;
		appearance: none;
	}
</style>
