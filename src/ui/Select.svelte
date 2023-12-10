<script>
	import { css } from '@emotion/css';

	import stylingConstants from './styling-constants';

	// required format: { optionGroup: {option: { value: "someValue", label: "Some Label" } } }
	export let optionValueKey = 'value';
	export let optionLabelKey = 'label';
	export let optionsGroupObject;
	export let isEnabled = true;
	export let inputValue;
	export let textAlignOverride = undefined;

	const selectDynamicClass = css`
		text-align: ${textAlignOverride ? textAlignOverride : 'left'};
		border: 2px solid ${stylingConstants.colors.activeColor};
		:hover {
			border: 2px solid ${stylingConstants.colors.hoverColor};
		}
		:disabled {
			border-radius: ${stylingConstants.sizes.bioFieldBorderRadius};
		}
	`;
</script>

<div id="select-container" class="select-container">
	<select
		id="select"
		class={selectDynamicClass}
		bind:value={inputValue}
		on:click|stopPropagation
		disabled={!isEnabled}
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
	.select-container {
		width: -webkit-fill-available;
		width: -moz-available;
	}

	select {
		height: auto;
		width: 100%;
		outline: none;
		padding: 4px;
	}
	select:disabled {
		opacity: 1;
		background-color: white;
		-webkit-appearance: none; /* for webkit-based browsers */
		-moz-appearance: none; /* for Firefox */
		border: none;
		appearance: none;
	}

	.select {
		background-color: white;
	}
</style>
