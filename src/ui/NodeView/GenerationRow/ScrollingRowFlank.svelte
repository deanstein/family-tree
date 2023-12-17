<script>
	import { css } from '@emotion/css';

	import { scrollHorizontal } from '../../../lib/ui-management';
	import uiState from '../../../stores/ui-state';

	export let flank; // which side of the middle section should this appear?

	let rowFlankOuterContainerDynamicClass;

	$: {
		rowFlankOuterContainerDynamicClass = css`
			justify-content: ${flank === 'left' ? 'flex-end' : 'flex-start'};
		`;
	}
</script>

<div
	id="row-flank-outer-container"
	class="row-flank-outer-container {rowFlankOuterContainerDynamicClass}"
>
	<div id="row-flank-inner-container" class="row-flank-inner-container" on:wheel={scrollHorizontal}>
		<slot />
	</div>
</div>

<style>
	.row-flank-outer-container {
		display: flex;
		flex-grow: 1;
		flex-basis: 33%;
	}

	.row-flank-inner-container {
		display: flex;
		gap: 1vw;
		position: relative;
	}

	/* not used yet - attempting to get the scrollbar out of the container */
	.row-flank {
		display: flex;
		gap: 2em;
		position: relative;
	}

	.row-flank-inner-container2::-webkit-scrollbar {
		height: 10px; /* Set scrollbar height */
	}

	.row-flank-inner-container2::after {
		content: '';
		display: block;
		position: absolute;
		height: 10px; /* Set height of scrollbar */
		bottom: -10px;
		left: 0;
		right: 0;
		background-color: red; /* Set background color of scrollbar */
		z-index: 5; /* Ensure scrollbar is above content */
	}
</style>
