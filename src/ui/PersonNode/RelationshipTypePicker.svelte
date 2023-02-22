<script>
	// @ts-nocheck

	import { relationshipMap } from '../../stores/relationshipMap';
	import uiState from '../../stores/uiState';

	export let sInputValue = '';
	export let bEnabled = false;
</script>

<div id="relationship-type-picker-container" class="relationship-type-picker-container">
	<select
		id="options"
		class="relationship-type-picker"
		bind:value={sInputValue}
		on:click|stopPropagation
		on:keydown|stopPropagation
		disabled={!bEnabled}
	>
		{#each Object.entries(relationshipMap) as [category, items]}
			<optgroup label={items.label}>
				{#each Object.entries(items) as [key, value]}
					{#if key != 'label'}
						{#if value.label}
							<option value={`${category}-${key}`}>{value.label}</option>
						{/if}
					{/if}
				{/each}
			</optgroup>
		{/each}
	</select>
</div>

<style>
	.relationship-type-picker-container {
		margin-bottom: 1vh;
		padding-left: 1vh;
		padding-right: 1vh;
	}
	.relationship-type-picker {
		width: 100%;
		border: 1px solid blue;
		font-style: italic;
	}
	.relationship-type-picker:disabled {
		-webkit-appearance: none; /* for webkit-based browsers */
		-moz-appearance: none; /* for Firefox */
		text-align: center;
		appearance: none;
		border: none;
		font-style: italic;
	}
</style>
