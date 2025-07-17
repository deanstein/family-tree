<script>
	import { css } from '@emotion/css';

	import FieldLabel from '$lib/components/InputLabel.svelte';

	export let label = 'Some Fact or Field Name';
	export let grow = false;

	const bioFieldContainerCss = css`
		flex-grow: ${grow ? 1 : 'auto'};
	`;
</script>

<div class="bio-field-container {bioFieldContainerCss}">
	<div class="bio-field-content">
		<FieldLabel {label} />
		<slot />
	</div>
</div>

<style>
	.bio-field-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		margin-bottom: 1svh;
	}

	.bio-field-content {
		display: flex;
		flex-direction: column;
		min-height: 2vh;
		height: 100%;
	}
</style>
