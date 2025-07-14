<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';

	import composeButtonTypes from '$lib/schemas/compose-button-types';

	import ComposeButton from './ComposeButton.svelte';

	export let isEditActive = false; // when active, show done/cancel
	export let onComposeButtonClick; // edit, add, etc
	export let composeButtonTooltip = 'Compose';
	export let onDoneButtonClick;
	export let doneButtonLabel = 'Done';
	export let doneButtonTooltip = 'Done';
	export let onCancelButtonClick;
	export let cancelButtonLabel = 'Cancel';
	export let cancelButtonTooltip = 'Cancel';
	export let onDeleteButtonClick = undefined; // if provided, show delete
	export let deleteButtonTooltip = 'Delete';
	export let deleteButtonLabel = 'Delete';

	let composeContainerRef;
	let composeButtonHeight;
	let composeToolbarWrapperRef;
	let composeWrapperHeight;

	onMount(() => {
		// capture the height so it doesn't change when editing is enabled
		composeButtonHeight = composeContainerRef.clientHeight;
		composeWrapperHeight = composeToolbarWrapperRef.offsetHeight;
	});

	let composeContainerCss = css``;
	$: {
		composeContainerCss = css`
			height: ${composeButtonHeight}px;
			background-color: ${isEditActive ? 'rgba(255, 255, 255, 0.75)' : ''};
		`;
	}
</script>

<div bind:this={composeToolbarWrapperRef} class="toolbar-wrapper">
	<div bind:this={composeContainerRef} class="compose-button-container {composeContainerCss}">
		<!-- show compose button if not in edit mode -->
		{#if !isEditActive}
			<ComposeButton
				onClickFunction={onComposeButtonClick}
				tooltip={composeButtonTooltip}
				buttonType={composeButtonTypes.edit.type}
			/>
		{:else if isEditActive}
			<!-- show delete if function is provided -->
			{#if onDeleteButtonClick}
				<ComposeButton
					onClickFunction={onDeleteButtonClick}
					buttonType={composeButtonTypes.delete.type}
					label={deleteButtonLabel}
					tooltip={deleteButtonTooltip}
				/>
			{/if}
			<!-- show done/cancel buttons if in edit mode -->
			<ComposeButton
				onClickFunction={onCancelButtonClick}
				buttonType={composeButtonTypes.cancel.type}
				label={cancelButtonLabel}
				tooltip={cancelButtonTooltip}
			/>
			<ComposeButton
				onClickFunction={onDoneButtonClick}
				buttonType={composeButtonTypes.confirm.type}
				label={doneButtonLabel}
				tooltip={doneButtonTooltip}
			/>
		{/if}
	</div>
</div>

<style>
	.toolbar-wrapper {
		position: absolute;
		top: 0;
		width: 100%;
		height: 100%;
		right: 10px;
		pointer-events: none;
	}

	.compose-button-container {
		position: sticky;
		display: flex;
		align-items: center;
		justify-content: right;
		top: 250px;
		width: 100%;
		gap: 1rem;
		padding-top: 0.5rem;
		margin-bottom: 0.5rem;
		z-index: 1000;
		pointer-events: all;
	}
</style>
