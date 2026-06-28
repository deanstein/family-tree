<script>
	import { css } from '@emotion/css';

	export let flank; // which side of the middle section should this appear?

	let rowFlankOuterContainerCss;

	$: {
		rowFlankOuterContainerCss = css`
			justify-content: ${flank === 'left' ? 'flex-end' : 'flex-start'};
		`;
	}
</script>

<div class="row-flank-outer-container {rowFlankOuterContainerCss}">
	<div class="row-flank-inner-container">
		<slot />
	</div>
</div>

<style>
	.row-flank-outer-container {
		display: flex;
		flex: 1 1 0;
		min-width: auto;
	}

	.row-flank-inner-container {
		display: flex;
		gap: 1vw;
		position: relative;
	}
</style>
