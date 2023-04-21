<script>
	import { css } from '@emotion/css';

	import uiState from '../../stores/uiState';

	export let flank; // which side of the middle section should this appear?

	let rowFlankOuterContainerDynamicClass;
	let rowFlankInnerContainerDynamicClass;

	function scrollHorizontal(event) {
		const delta = event.deltaX || event.deltaY;
		event.currentTarget.scrollBy(delta, 0);
		event.preventDefault();
	}

	$: {
		rowFlankOuterContainerDynamicClass = css`
			justify-content: ${flank === 'left' ? 'flex-end' : 'flex-start'};
		`;

		rowFlankInnerContainerDynamicClass = css`
			overflow-x: ${$uiState.personIdForNodeEdit !== undefined ? `clip` : `initial`};
			overflow-y: ${$uiState.personIdForNodeEdit !== undefined ? `initial` : `auto`};
		`;
	}
</script>

<div
	id="row-flank-outer-container"
	class="row-flank-outer-container {rowFlankOuterContainerDynamicClass}"
>
	<div
		id="row-flank-inner-container"
		class="row-flank-inner-container {rowFlankInnerContainerDynamicClass}"
		on:wheel={scrollHorizontal}
	>
		<slot />
	</div>
</div>

<style>
	.row-flank-outer-container {
		display: flex;
		flex-grow: 1;
		flex-basis: 33%;
		overflow: auto;
	}

	.row-flank-inner-container {
		display: flex;
		gap: 2em;
	}

	/* not used yet - attempting to get the scrollbar out of the container */
	.row-flank {
		display: flex;
		gap: 2em;
		position: relative;
	}

	.row-flank::-webkit-scrollbar {
		height: 10px; /* Set scrollbar height */
	}

	.row-flank::after {
		content: '';
		display: block;
		position: absolute;
		height: 10px; /* Set height of scrollbar */
		bottom: -10px;
		left: 0;
		right: 0;
		background-color: #f1f1f1; /* Set background color of scrollbar */
		z-index: 1; /* Ensure scrollbar is above content */
	}
</style>
