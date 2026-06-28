<script>
	import { css } from '@emotion/css';

	import composeButtonTypes from '$lib/schemas/compose-button-types';
	import { getNearestScrollingElement } from '$lib/utils';

	import ComposeButton from './ComposeButton.svelte';

	export let parentRef; // required (for the default float behavior) to position the button
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
	// When true, pin the compose button to the bottom of the parent box
	// (use when the parent is a bounded box that scrolls internally, e.g. the
	// timeline). When false (default), the button floats relative to the nearest
	// scrolling ancestor (used where the parent itself grows with its content).
	export let anchorToBottom = false;

	// distance from the edges the compose button should appear
	const distanceFromEdgesPx = 50;

	let parentHeight = 0;
	let parentWidth = 0;
	let buttonWidthHeight = 0;
	let distanceFromTopPx = 0;
	/** @type {HTMLElement | undefined} */
	let composeContainerRef;
	/** @type {HTMLElement | undefined} */
	let composeToolbarWrapperRef;

	// default (float) positioning: measure the nearest scrolling ancestor
	// (skipped implicitly in anchored mode, where composeContainerRef is unset)
	$: {
		if (composeToolbarWrapperRef && composeContainerRef) {
			// compose button is assumed circular, so width is same as height
			buttonWidthHeight = composeContainerRef.getBoundingClientRect().height;
		}

		if (parentRef && composeContainerRef) {
			const scrollingContainer = getNearestScrollingElement(parentRef);
			parentHeight = scrollingContainer.getBoundingClientRect().height;
			parentWidth = scrollingContainer.getBoundingClientRect().width;
			distanceFromTopPx = parentHeight - buttonWidthHeight - distanceFromEdgesPx;
		}
	}

	let composeButtonWrapperCss = css``;
	$: composeButtonWrapperCss = css`
		padding-right: ${distanceFromEdgesPx}px;
	`;

	let composeStickyContainerCss = css``;
	$: composeStickyContainerCss = css`
		top: ${isEditActive ? 0 : distanceFromTopPx}px;
		margin-top: ${distanceFromEdgesPx}px;
		margin-bottom: ${distanceFromEdgesPx}px;
		z-index: ${zIndex};
	`;

	let zIndexCss = css``;
	$: zIndexCss = css`
		z-index: ${zIndex};
	`;
</script>

<div bind:this={composeToolbarWrapperRef} class="compose-button-absolute-wrapper">
	{#if anchorToBottom}
		<!-- Pin to the bottom-right of the (bounded) parent box -->
		{#if !isEditActive}
			<div class="compose-button-anchored {zIndexCss}">
				<ComposeButton
					onClickFunction={onClickCompose}
					faIcon={composeButtonFaIcon}
					tooltip={composeButtonTooltip}
					buttonType={composeButtonTypes.edit.type}
				/>
			</div>
		{:else}
			<div class="compose-button-toolbar-wrapper {zIndexCss}">
				{#if onClickDelete}
					<ComposeButton
						onClickFunction={onClickDelete}
						buttonType={composeButtonTypes.delete.type}
						label={deleteButtonLabel}
						tooltip={deleteButtonTooltip}
					/>
				{/if}
				{#if onClickCancel && onClickDone}
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
	{:else}
		<!-- Default: float relative to the nearest scrolling ancestor -->
		<div
			bind:this={composeContainerRef}
			class="compose-button-sticky-wrapper {composeStickyContainerCss}"
		>
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
					{#if onClickDelete}
						<ComposeButton
							onClickFunction={onClickDelete}
							buttonType={composeButtonTypes.delete.type}
							label={deleteButtonLabel}
							tooltip={deleteButtonTooltip}
						/>
					{/if}
					{#if onClickCancel && onClickDone}
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
	{/if}
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

	/* anchored mode: pin to the bottom-right of the parent box,
	   stays put regardless of anything stacked above (e.g. a banner) */
	.compose-button-anchored {
		position: absolute;
		bottom: 50px;
		right: 50px;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		pointer-events: auto;
	}

	.compose-button-toolbar-wrapper {
		display: flex;
		position: absolute;
		top: 0;
		left: 0;
		justify-content: flex-end;
		width: 100%;
		padding: 1rem;
		gap: 1rem;
		background-color: rgba(255, 254, 248, 0.9);
		pointer-events: auto;
	}
</style>
