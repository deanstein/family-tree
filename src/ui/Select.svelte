<script>
	import { css } from '@emotion/css';

	import stylingConstants from './styling-constants';

	// required format: { optionGroup: {option: { value: "someValue", label: "Some Label" } } }
	export let optionValueKey = 'value';
	export let optionLabelKey = 'label';
	export let optionsGroupObject;
	export let isEnabled = true;
	export let inputValue;

	const selectDynamicClass = css`
		border: 2px solid ${stylingConstants.colors.activeColor};
		:hover {
			border: 2px solid ${stylingConstants.colors.hoverColor};
		}
		font-size: ${stylingConstants.sizes.personNodeFontSize};
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
		padding-left: 5px;
		height: 1vw;
		width: 100%;
		outline: none;
	}
	select:disabled {
		-webkit-appearance: none; /* for webkit-based browsers */
		-moz-appearance: none; /* for Firefox */
		border: none;
		appearance: none;
	}
</style>
