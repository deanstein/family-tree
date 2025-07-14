<script>
	import { css } from '@emotion/css';

	import composeButtonTypes from '$lib/schemas/compose-button-types';

	import ComposeButton from './ComposeButton.svelte';
	import stylingConstants from './styling-constants';
	import { getPxFromSvh } from '$lib/utils';

	export let heightFromTopPx = getPxFromSvh(stylingConstants.sizes.nModalFormHeight);
	export let isEditActive = false; // when active, show done/cancel
	export let onClickCompose; // edit, add, etc
	export let composeButtonFaIcon = 'fa-pencil';
	export let composeButtonTooltip = 'Compose';
	export let onClickDone = undefined; // if provided, show done
	export let doneButtonLabel = 'Done';
	export let doneButtonTooltip = 'Done';
	export let onClickCancel = undefined; // if provided, show cancel
	export let cancelButtonLabel = 'Cancel';
	export let cancelButtonTooltip = 'Cancel';
	export let onClickDelete = undefined; // if provided, show delete
	export let deleteButtonTooltip = 'Delete';
	export let deleteButtonLabel = 'Delete';

	let composeContainerRef;
	let composeButtonHeight;
	let composeToolbarWrapperRef;

	let composeContainerCss = css``;
	$: {
		composeContainerCss = css`
			height: ${composeButtonHeight}px;
			top: ${isEditActive ? 0 : heightFromTopPx}px;
		`;
	}
</script>

<div bind:this={composeToolbarWrapperRef} class="toolbar-wrapper">
	<div bind:this={composeContainerRef} class="compose-button-container {composeContainerCss}">
		<!-- show compose button if not in edit mode -->
		{#if !isEditActive}
			<ComposeButton
				onClickFunction={onClickCompose}
				faIcon={composeButtonFaIcon}
				tooltip={composeButtonTooltip}
				buttonType={composeButtonTypes.edit.type}
			/>
		{:else if isEditActive}
			<!-- show delete if function is provided -->
			{#if onClickDelete}
				<ComposeButton
					onClickFunction={onClickDelete}
					buttonType={composeButtonTypes.delete.type}
					label={deleteButtonLabel}
					tooltip={deleteButtonTooltip}
				/>
			{/if}
			{#if onClickCancel && onClickDone}
				<!-- show done/cancel buttons if in edit mode -->
				<ComposeButton
					onClickFunction={onClickCancel}
					buttonType={composeButtonTypes.cancel.type}
					label={cancelButtonLabel}
					tooltip={cancelButtonTooltip}
				/>
				<ComposeButton
					onClickFunction={onClickDone}
					buttonType={composeButtonTypes.confirm.type}
					label={doneButtonLabel}
					tooltip={doneButtonTooltip}
				/>
			{/if}
		{/if}
	</div>
</div>

<style>
	.toolbar-wrapper {
		position: absolute;
		top: 0;
		right: 0.5rem;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.compose-button-container {
		position: sticky;
		display: flex;
		align-items: center;
		justify-content: right;
		width: 100%;
		gap: 1rem;
		padding-top: 0.5rem;
		margin-bottom: 0.5rem;
		z-index: 1000;
	}
</style>
