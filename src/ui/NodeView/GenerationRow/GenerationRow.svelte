<script>
	import { css } from '@emotion/css';

	export let rowHeight = '15vh';

	const rowDynamicClass = css`
		height: ${rowHeight};
	`;
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
		background-color: rgba(225, 225, 225, 0.65);
		display: flex;
		align-items: center;
		justify-content: center;
		max-width: 100vw;
		box-sizing: border-box;
		grid-gap: 1vw;
		padding: 0 25px 0 25px;
	}

	.row-middle-section {
		justify-content: center;
	}
</style>
