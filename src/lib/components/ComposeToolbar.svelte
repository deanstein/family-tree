<script>
	import { css } from '@emotion/css';

	import composeButtonTypes from '$lib/schemas/compose-button-types';
	import { getNearestScrollingElement } from '$lib/utils';

	import ComposeButton from './ComposeButton.svelte';

	export let parentRef; // required to determine where to show the compose button
	export let isEditActive = false; // when active, show done/cancel
	export let onClickCompose; // edit, add, etc
	export let composeButtonFaIcon = 'fa-pencil fa-fw';
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
	export let zIndex = 1000; // override depending on the context

	// distance from top or right edge the compose button should appear
	const distanceFromEdgesPx = 50;

	let parentHeight;
	let parentWidth;
	let buttonWidthHeight;
	let distanceFromTopPx;
	let composeContainerRef;
	let composeToolbarWrapperRef;

	// determine the height and width at which to show the compose button
	$: {
		if (composeToolbarWrapperRef) {
			// compose button is assumed circular, so width is same as height
			buttonWidthHeight = composeContainerRef.getBoundingClientRect().height;
		}

		if (parentRef) {
			const scrollingContainer = getNearestScrollingElement(parentRef);
			parentHeight = scrollingContainer.getBoundingClientRect().height;
			parentWidth = scrollingContainer.getBoundingClientRect().width;
			distanceFromTopPx = parentHeight - buttonWidthHeight - distanceFromEdgesPx;
		}
	}

	let composeButtonWrapperCss = css``;
	$: {
		composeButtonWrapperCss = css`
			padding-right: ${distanceFromEdgesPx}px;
		`;
	}

	let composeStickyContainerCss = css``;
	$: {
		composeStickyContainerCss = css`
			top: ${isEditActive ? 0 : distanceFromTopPx}px;
			margin-top: ${distanceFromEdgesPx}px;
			margin-bottom: ${distanceFromEdgesPx}px;
			z-index: ${zIndex};
		`;
	}
</script>

<div bind:this={composeToolbarWrapperRef} class="compose-button-absolute-wrapper">
	<div
		bind:this={composeContainerRef}
		class="compose-button-sticky-wrapper {composeStickyContainerCss}"
	>
		<!-- show compose button if not in edit mode -->
		{#if !isEditActive}
			<div class="compose-button-wrapper {composeButtonWrapperCss}">
				<ComposeButton
					onClickFunction={onClickCompose}
					faIcon={composeButtonFaIcon}
					tooltip={composeButtonTooltip}
					buttonType={composeButtonTypes.edit.type}
				/>
			</div>
		{:else if isEditActive}
			<div class="compose-button-toolbar-wrapper">
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
			</div>
		{/if}
	</div>
</div>

<style>
	.compose-button-absolute-wrapper {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.compose-button-sticky-wrapper {
		position: sticky;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		width: 100%;
		gap: 1rem;
	}

	.compose-button-toolbar-wrapper {
		display: flex;
		position: absolute;
		top: 0;
		justify-content: flex-end;
		width: 100%;
		padding: 1rem;
		gap: 1rem;
		background-color: rgba(255, 254, 248, 0.9);
	}
</style>
