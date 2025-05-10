<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';

	import timelineEventTypes from '$lib/schemas/timeline-event-types';
	import timelineEventReference from '$lib/schemas/timeline-event-reference';

	import uiState from '$lib/stores/ui-state';

	import { getNumberOfYearsBetweenEvents, instantiateObject } from '$lib/utils';
	import { getPersonById, setActivePerson, upgradeTimelineEvent } from '$lib/person-management';
	import {
		hidePersonDetailView,
		setFirstTimelineEventHeight,
		setLastTimelineEventHeight
	} from '$lib/ui-management';

	import { monthNames } from '$lib/components/strings';

	import { JDGButton } from 'jdg-ui-svelte';
	import ImageThumbnailGroup from '$lib/components/ImageThumbnailGroup.svelte';
	import stylingConstants from '$lib/components/styling-constants';
	import { timelineEditEvent } from '$lib/states/temp-state';

	export let timelineEvent;
	// if this is set, this event is a reference to someone else's event
	// so it will display and interact differently
	export let eventReference = instantiateObject(timelineEventReference);
	export let onClickFunction = undefined;
	export let backgroundColor = stylingConstants.colors.activeColorSubtle;
	export let rowIndex;

	let eventDateCorrected;
	let eventAge;
	let eventRowDivRef;

	const showTimelineEventDetails = () => {
		// do nothing if this is the "today" event (no death date)
		if (timelineEvent.eventType === timelineEventTypes.today.type) {
			return;
		}
		timelineEditEvent.set(timelineEvent);
	};

	// this is what happens when the link is clicked
	// to an eventReference personId
	const makeEventReferencePersonActive = () => {
		hidePersonDetailView();
		setActivePerson(getPersonById(eventReference.personId));
	};

	const eventRowCss = css`
		gap: ${stylingConstants.sizes.timelineEventGapSize};
	`;

	const eventRowContainerCss = css`
		cursor: ${eventReference.personId || timelineEvent.eventType === timelineEventTypes.today.type
			? 'default'
			: 'pointer'};
	`;

	const eventDateYearCss = css`
		margin-left: ${stylingConstants.sizes.timelineEventGapSize};
	`;

	const eventDateCss = css`
		font-size: ${stylingConstants.sizes.timelineDateFontSize};
		width: ${stylingConstants.sizes.timelineEventYearWidth};
		color: ${stylingConstants.colors.textColor};
		background-color: ${stylingConstants.colors.activeColorSubtle};
	`;

	const eventYearCss = css`
		font-size: ${stylingConstants.sizes.timelineYearFontSize};
		width: ${stylingConstants.sizes.timelineEventYearWidth};
		color: ${stylingConstants.colors.textColor};
		background-color: ${stylingConstants.colors.activeColorSubtle};
	`;

	const eventNodeCss = css`
		height: ${stylingConstants.sizes.timelineEventNodeSize};
		background-color: ${stylingConstants.colors.textColor};
	`;

	const eventDetailLineCss = css`
		background-color: ${stylingConstants.colors.textColor};
	`;

	const eventTitleBarCss = css`
		background-color: ${stylingConstants.colors.timelineEventTitleBarColor};
		border-radius: ${stylingConstants.sizes.bioFieldBorderRadius}
			${stylingConstants.sizes.bioFieldBorderRadius} 0px 0px;
	`;

	const eventFaIconCss = css`
		color: ${stylingConstants.colors.textColor};
	`;

	const eventAgeCss = css`
		color: ${stylingConstants.colors.textColor};
	`;

	const eventContentCss = css`
		background-color: ${backgroundColor};
		border-radius: 0px 0px ${stylingConstants.sizes.bioFieldBorderRadius}
			${stylingConstants.sizes.bioFieldBorderRadius};
	`;

	onMount(() => {
		// upgrade the timeline event so it has the right fields for downstream operations
		const upgradedEvent = upgradeTimelineEvent(timelineEvent);

		// birth and death events report their row height for the spine to align to
		if (upgradedEvent.eventType === timelineEventTypes.birth.type && eventRowDivRef) {
			const eventRowHeight = eventRowDivRef.getBoundingClientRect().height;
			setFirstTimelineEventHeight(eventRowHeight);
		}
		if (upgradedEvent.eventType === timelineEventTypes.death.type && eventRowDivRef) {
			const eventRowHeight = eventRowDivRef.getBoundingClientRect().height;
			setLastTimelineEventHeight(eventRowHeight);
		}

		// if onClick isn't provided, use this function
		onClickFunction =
			(onClickFunction ?? eventReference.personId) ? () => {} : showTimelineEventDetails;
	});

	$: {
		if (timelineEvent) {
			eventDateCorrected = new Date(timelineEvent.eventDate);

			eventAge = getNumberOfYearsBetweenEvents(
				$uiState.activePerson.birth.date,
				eventDateCorrected
			);
		}
	}

	// dynamic CSS
	let eventRowDynamicCss = css``;
	$: {
		eventRowDynamicCss = css`
			grid-row: ${rowIndex};
			cursor: ${eventReference.personId || timelineEvent.eventType === timelineEventTypes.today.type
				? 'default'
				: 'pointer'};
			&:hover {
				background-color: ${eventReference.personId ||
				timelineEvent.eventType === timelineEventTypes.today.type
					? ''
					: stylingConstants.colors.timelineEventBackgroundHoverColor};
			}
		`;
	}
</script>

<div
	class="timeline-event-row {eventRowCss} {eventRowDynamicCss}"
	role="button"
	tabindex="0"
	on:click={onClickFunction}
	on:keydown={onClickFunction}
	bind:this={eventRowDivRef}
>
	<div class="timeline-event-date-year-container {eventDateYearCss}">
		<div class="timeline-event-date {eventDateCss}">
			<!-- show month name with three letters like AUG -->
			{eventDateCorrected.toString() !== 'Invalid Date'
				? monthNames[eventDateCorrected.getUTCMonth()] + ' ' + eventDateCorrected.getUTCDate()
				: 'Date?'}
		</div>
		<div class="timeline-event-year {eventYearCss}">
			{eventDateCorrected.toString() !== 'Invalid Date'
				? eventDateCorrected.getUTCFullYear()
				: 'Year?'}
		</div>
		{#if timelineEvent?.isApprxDate}
			<div class="timeline-event-date-apprx">(apprx.)</div>
		{/if}
	</div>
	<div class="timeline-event-node {eventNodeCss}" />
	<div class="timeline-event-line {eventDetailLineCss}" />
	<div class="timeline-event-content-outer-container {eventRowContainerCss}">
		<div class="timeline-event-title-bar {eventTitleBarCss}">
			<!-- event icon -->
			<i class="fa-solid {timelineEventTypes[timelineEvent?.eventType]?.icon} {eventFaIconCss}" />
			<!-- hide age if this is the birth event -->
			{#if timelineEvent.eventType !== timelineEventTypes.birth.type}
				<div class="timeline-event-age {eventAgeCss}">
					{eventAge.toString() !== 'NaN' ? 'Age: ' : ''}
					{eventAge.toString() !== 'NaN' ? eventAge : ''}
				</div>
			{/if}
			<!-- if this is a shared event, show who it's shared from -->
			{#if eventReference.personId}
				<div>
					<div class="timeline-event-reference-info">
						<i> &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp; Shared event from &nbsp; </i>
						<JDGButton
							onClickFunction={makeEventReferencePersonActive}
							faIcon={'fa-circle-arrow-right'}
							backgroundColor={stylingConstants.colors.activePersonNodeColor}
							paddingLeftRight="8px"
							paddingTopBottom="2px"
							fontSize="12px"
							gap="6px"
							label={getPersonById(eventReference?.personId)?.name}
							tooltip={'Go to ' + getPersonById(eventReference?.personId)?.name}
						/>
					</div>
				</div>
			{/if}
		</div>
		<div class="timeline-event-content {eventContentCss}">
			<div class="timeline-event-description">
				{timelineEvent?.eventContent?.description
					? timelineEvent?.eventContent?.description
					: 'Event description'}
			</div>
			{#if timelineEvent?.eventContent?.images?.length > 0}
				<div class="timeline-event-image-preview">
					<!-- show a few of the timeline event images, if there are any -->
					<ImageThumbnailGroup
						imageArray={timelineEvent?.eventContent?.images}
						showGroupTitle={false}
						showAddButton={false}
					/>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.timeline-event-row {
		max-width: 100%;
		display: flex;
		align-items: center;
		padding-top: 2px;
		padding-bottom: 2px;
	}

	.timeline-event-date-year-container {
		display: flex;
		flex-direction: column;
	}

	.timeline-event-date {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 5px 5px 0px 0px;
	}

	.timeline-event-year {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 0px 0px 5px 5px;
	}

	.timeline-event-date-apprx {
		display: flex;
		width: -webkit-fill-available;
		width: -moz-available;
		justify-content: center;
		font-size: 10px;
		padding-top: 3px;
	}

	.timeline-event-node {
		border-radius: 1vw;
		aspect-ratio: 1;
	}

	.timeline-event-line {
		display: flex;
		flex-shrink: 0;
		height: 0.5vh;
		width: 2vw;
	}

	.timeline-event-title-bar {
		display: flex;
		flex-basis: 0;
		flex-grow: 1;
		width: -webkit-fill-available;
		padding: 5px 10px 5px 10px;
	}

	/* font awesome icon */
	.fa-solid {
		display: flex;
		align-items: center;
		font-size: 20px;
	}

	.timeline-event-age {
		padding-left: 10px;
		font-style: italic;
	}

	.timeline-event-content-outer-container {
		display: flex;
		flex-direction: column;
		padding: 3px;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.timeline-event-content {
		padding: 0px 8px 0px 8px;
	}

	.timeline-event-description {
		padding: 8px 0px 8px 0px;
	}

	.timeline-event-image-preview {
		padding-bottom: 8px;
	}

	.timeline-event-reference-info {
		display: flex;
	}
</style>
