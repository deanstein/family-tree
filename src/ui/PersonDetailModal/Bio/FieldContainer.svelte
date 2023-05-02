<script>
	import FieldLabel from './FieldLabel.svelte';

	export let label = 'Some Fact or Field Name';
</script>

<div id="bio-field-container" class="bio-field-container">
    <div id="bio-field-content" class="bio-field-content" > 
        <FieldLabel {label} />
        <slot />
    </div>
</div>

<style>
	.bio-field-container {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

    .bio-field-content {
        min-height: 2vh;
    }
</style>
