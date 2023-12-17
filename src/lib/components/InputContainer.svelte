<script>
	import { css } from '@emotion/css';

	import FieldLabel from '$lib/components/InputLabel.svelte';

	export let label = 'Some Fact or Field Name';
	export let grow = false;

	const bioFieldContainerDynamicClass = css`
		flex-grow: ${grow ? 1 : 'auto'};
	`;
</script>

<div id="bio-field-container" class="{bioFieldContainerDynamicClass} bio-field-container">
	<div id="bio-field-content" class="bio-field-content">
		<FieldLabel {label} />
		<slot />
	</div>
</div>

<style>
	.bio-field-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-bottom: 1vh;
	}

	.bio-field-content {
		display: flex;
		flex-direction: column;
		min-height: 2vh;
		height: 100%;
	}
</style>
