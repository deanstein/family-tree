<script>
	import FieldLabel from './FieldLabel.svelte';

	export let label = 'Some Fact or Field Name';
</script>

<div id="bio-field-container" class="bio-field-container">
	<FieldLabel {label} />
	<slot />
</div>

<style>
	.bio-field-container {
		display: flex;
		flex-direction: column;
		width: 100%;
	}
</style>
