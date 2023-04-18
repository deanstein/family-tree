<script>
	import { css } from '@emotion/css';

	export let rowHeight = '15vh';

	const rowDynamicClass = css`
		height: ${rowHeight};
	`;
</script>

<div id="row" class="{rowDynamicClass} row">
	<div id="row-left-flank" class="row-left-flank">
		<slot name="row-left-flank" />
	</div>
	<div id="row-middle-section" class="row-middle-section">
		<slot name="row-middle-section" />
	</div>
	<div id="row-right-flank" class="row-right-flank">
		<slot name="row-right-flank" />
	</div>
</div>

<style>
	.row {
		background-color: lightgray;
		display: flex;
		align-items: center;
		justify-content: center;
		grid-gap: 2em;
	}

	.row-left-flank,
	.row-right-flank {
		display: flex;
		flex-grow: 1;
		flex-basis: 33%;
	}

	.row-left-flank {
		justify-content: right;
	}

	.row-middle-section {
		justify-content: center;
	}

	.row-right-flank {
		justify-content: left;
	}
</style>
