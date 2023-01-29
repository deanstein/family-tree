<script>
	import { css } from '@emotion/css';

	export let rowHeight = '15vh';

	const rowDynamicClass = css`
		height: ${rowHeight};
	`;
</script>

<div id='row' class="{rowDynamicClass} row">
	<slot />
</div>

<style>
	.row {
		background-color: lightgray;
		display: flex;
		align-items: center;
		justify-content: center;
		grid-gap: 2em;
	}
</style>
