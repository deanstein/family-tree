<script>
	import { css } from '@emotion/css';

	import stylingConstants from './styling-constants';

	import CircularButton from './CircularButton.svelte';

	export let onClickFunction = {};

	let personNodePlaceholderDynamicStyle = css`
		width: ${stylingConstants.sizes.personNodeSize};
		height: ${stylingConstants.sizes.personNodeSize};
		background-color: rgb(200, 200, 200, 0.4);
	`;
</script>

<div
	id="person-node-placeholder-container"
	class="{personNodePlaceholderDynamicStyle} person-node-placeholder-container"
>
	<CircularButton buttonText={'+'} {onClickFunction} />
</div>

<style>
	.person-node-placeholder-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
