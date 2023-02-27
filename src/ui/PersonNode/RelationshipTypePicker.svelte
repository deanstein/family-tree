<script>
	import { css } from '@emotion/css';
	import { addOrUpdatePersonReferenceObjectInActivePersonGroup } from '../../logic/personManagement';

	import relationshipMap from '../../stores/relationshipMap';
	import stylingConstants from '../../stores/stylingConstants';

    export let sPersonId;
	export let bIsActivePerson = false;
	export let bEnabled = false;
    export let sInputValue;

	const onBlurAction = () => {
        addOrUpdatePersonReferenceObjectInActivePersonGroup(sPersonId, sInputValue)
    };

	const relationshipTypePickerContainerDynamicClass = css`
		margin-bottom: ${stylingConstants.sizes.padding};
		padding-left: ${stylingConstants.sizes.padding};
		padding-right: ${stylingConstants.sizes.padding};
	`

	const relationshipTypePickerDynamicClass = css`
		border: 2px solid ${stylingConstants.colors.sActiveInputHighlightColor};
	`;
</script>

<div id="relationship-type-picker-container" class="{relationshipTypePickerContainerDynamicClass} relationship-type-picker-container">
	<select
		id="options"
		class="{relationshipTypePickerDynamicClass} relationship-type-picker"
		bind:value={sInputValue}
		on:click|stopPropagation
		on:keydown|stopPropagation
		on:blur={onBlurAction}
		disabled={!bEnabled}
	>
		{#each Object.entries(relationshipMap) as [category, items]}
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
