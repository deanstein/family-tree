<script>
	import { css } from '@emotion/css';

	export let rowHeight = '15vh';
	export let nColumns = 3;

	const rowDynamicClass = css`
		grid-template-columns: repeat(${nColumns}, 1fr);
		grid-auto-rows: ${rowHeight};
	`;
</script>

<main>
	<div class="{rowDynamicClass} row">
		<slot />
	</div>
</main>

<style>
	.row {
		background-color: lightgray;
		display: flex;
		align-items: center;
		justify-content: center;
		grid-gap: 2em;
	}
</style>
