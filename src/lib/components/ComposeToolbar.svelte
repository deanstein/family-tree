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

	let parentHeight;
	let parentWidth;
	let buttonWidth;
	let distanceFromTopPx;
	let distanceFromRightPx;
	let composeContainerRef;
	let composeToolbarWrapperRef;

	// determine the height and width at which to show the compose button
	$: {
		if (composeToolbarWrapperRef) {
			// compose button is assumed circular, so width is same as height
			buttonWidth = composeContainerRef.getBoundingClientRect().height;
		}

		if (parentRef) {
			const scrollingContainer = getNearestScrollingElement(parentRef);
			parentHeight = scrollingContainer.getBoundingClientRect().height;
			parentWidth = scrollingContainer.getBoundingClientRect().width;
			distanceFromTopPx = parentHeight - buttonWidth - 50;
		}
	}

	let composeContainerCss = css``;
	$: {
		composeContainerCss = css`
			top: ${isEditActive ? 0 : distanceFromTopPx}px;
			z-index: ${zIndex};
		`;
	}

	let composeButtonWrapperCss = css`
		margin-right: 50px;
	`;
</script>

<div bind:this={composeToolbarWrapperRef} class="compose-button-absolute-wrapper">
	<div bind:this={composeContainerRef} class="compose-button-sticky-wrapper {composeContainerCss}">
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
			<div class="compose-button-wrapper {composeButtonWrapperCss}"></div>
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
	.compose-button-absolute-wrapper {
		position: absolute;
		top: 0;
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
		padding-top: 1rem;
		margin-bottom: 1rem;
	}

	.compose-button-wrapper {
	}
</style>
