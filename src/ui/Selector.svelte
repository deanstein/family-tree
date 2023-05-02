<script>
	import { css } from '@emotion/css';

    import stylingConstants from './styling-constants';

    // required format: { optionGroup: {option: { value: "someValue", label: "Some Label" } } }
    export let optionValueKey = "value";
    export let optionLabelKey = "label";
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
        <optgroup label={items[optionLabelKey]}>
        {#each Object.entries(items) as [key, value]}
            {#if key !== optionLabelKey}
            {#if value[optionLabelKey]}
                <option value={`${value[optionValueKey]}`}>{value[optionLabelKey]}</option>
            {/if}
            {/if}
        {/each}
        </optgroup>
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
