<script>
	import { css } from '@emotion/css';
	import stylingConstants from '../stores/stylingConstants';
	import PersonNodeAddButton from './PersonNodeAddButton.svelte';

	export let relationshipId;

	let personNodePlaceholderDynamicStyle = css`
		width: ${stylingConstants.sizes.personNodeSize};
		height: ${stylingConstants.sizes.personNodeSize};
		background-color: lightgray;
	`;
</script>

<div
	id="person-node-placeholder-container"
	class="{personNodePlaceholderDynamicStyle} person-node-placeholder-container"
>
	<PersonNodeAddButton {relationshipId} />
</div>

<style>
	.person-node-placeholder-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
