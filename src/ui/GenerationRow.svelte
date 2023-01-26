<script>
  	import { css } from '@emotion/css'

	export let rowHeight = '250px';
	export let numberOfColumns = 3;

	const rowDynamicClass = css`
		grid-template-columns: repeat(${numberOfColumns}, 1fr );
		grid-auto-rows: ${rowHeight}; 
	`
</script>

<main>
	<div id="row" class="{rowDynamicClass} row">
		<slot />
	</div>
</main>

<style>
	.row {
		background-color: lightgray;
		display: grid;
		align-items: center;
		grid-gap: 2em;
		place-items: center;
	}
</style>
