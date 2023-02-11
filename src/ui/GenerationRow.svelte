<script>
	import { css } from '@emotion/css';

	export let rowHeight = '15vh';

	const rowDynamicClass = css`
		height: ${rowHeight};
	`;
</script>

<div id="row" class="{rowDynamicClass} row">
	<div id="row-left-section" class="row-left-section">
		<slot name="row-left-section" />
	</div>
	<div id="row-middle-section" class="row-middle-section">
		<slot name="row-middle-section" />
	</div>
	<div id="row-right-section" class="row-right-section">
		<slot name="row-right-section" />
	</div>
</div>

<style>
	.row {
		background-color: lightgray;
		display: flex;
		align-items: center;
		justify-content: center;
		grid-gap: 2em;

		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.row-left-section,
	.row-right-section {
		display: flex;
		flex-grow: 1;
		flex-basis: 33%;
	}

	.row-left-section {
		justify-content: right;
	}

	.row-middle-section {
		justify-content: center;
	}

	.row-right-section {
		justify-content: left;
	}
</style>
