<script>
	import { css } from '@emotion/css';

	export let rowHeight = '15vh';

	const rowDynamicClass = css`
		height: ${rowHeight};
	`;
</script>

<div class="{rowDynamicClass} row">
	<slot name="row-left-flank" />
	<div class="row-middle-section">
		<slot name="row-middle-section" />
	</div>
	<slot name="row-right-flank" />
</div>

<style>
	.row {
		background-color: rgba(210, 210, 210, 0.65);
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
