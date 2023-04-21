<script>
	import { css } from '@emotion/css';

	import uiState from '../../stores/uiState';

	export let rowHeight = '15vh';

	const rowDynamicClass = css`
		height: ${rowHeight};
	`;

	function handleWheel(event) {
		const delta = event.deltaX || event.deltaY;
		console.log(event.target);
		event.target.scrollBy(delta, 0);
		event.preventDefault();
	}
</script>

<div id="row" class="{rowDynamicClass} row">
	<slot name="row-left-flank" />
	<div id="row-middle-section" class="row-middle-section">
		<slot name="row-middle-section" />
	</div>
	<slot name="row-right-flank" />
</div>

<style>
	.row {
		background-color: lightgray;
		display: flex;
		align-items: center;
		justify-content: center;
		grid-gap: 2em;
		overflow: hidden;
		padding: 0 25px 0 25px;
	}

	.row-middle-section {
		justify-content: center;
	}

	/* .row-right-flank {
		justify-content: flex-start;
		overflow: auto;
	} */
</style>
