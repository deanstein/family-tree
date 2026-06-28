<script>
	import { css } from '@emotion/css';

	export let rowHeight = '15svh';
	export let rowColor = 'rgba(210, 210, 210, 0.65)';

	const rowCss = css`
		height: ${rowHeight};
		background-color: ${rowColor};
	`;
</script>

<div class="row {rowCss}">
	<slot name="row-left-flank" />
	<div class="row-middle-section">
		<slot name="row-middle-section" />
	</div>
	<slot name="row-right-flank" />
</div>

<style>
	.row {
		display: flex;
		align-items: center;
		justify-content: center;
		width: max-content;
		min-width: 100%;
		box-sizing: border-box;
		grid-gap: 1vw;
		padding: 0 25px 0 25px;
	}

	.row-middle-section {
		display: flex;
		flex: 0 0 auto;
		flex-shrink: 0;
		justify-content: center;
	}
</style>
