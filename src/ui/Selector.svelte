<script>
	import { css } from '@emotion/css';

    import stylingConstants from './styling-constants';

    // required format: { optionGroup: {option: { value: "someValue", label: "Some Label" } } }
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
        <optgroup label={items.label}>
        {#each Object.entries(items) as [key, value]}
            {#if key !== 'label'}
                {#if value.label}
                    <option value={`${value.value}`}>{value.label}</option>
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
