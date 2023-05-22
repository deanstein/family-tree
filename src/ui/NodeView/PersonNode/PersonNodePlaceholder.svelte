<script>
	import { css } from '@emotion/css';
	import stylingConstants from '../../styling-constants';
	import PersonNodeAddButton from '../PersonNodeGroup/AddPersonButton.svelte';

	export let relationshipId;
	export let compatibleGroups;

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
	<PersonNodeAddButton groupId={relationshipId} {compatibleGroups} />
</div>

<style>
	.person-node-placeholder-container {
		display: flex;
		align-items: center;
		justify-content: center;
	}
</style>
