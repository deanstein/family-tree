<script>
// @ts-nocheck

    import { relationshipMap } from "../../stores/relationshipMap";

    let selectedOption = '';
</script>

<select id="options" class='relationship-type-picker' bind:value={selectedOption} on:click|stopPropagation>
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

<style>
    .relationship-type-picker {
        width: 100%;
    }
</style>