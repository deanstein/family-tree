<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';

	import timelineEventTypes from '$lib/schemas/timeline-event-types';

	import uiState from '$lib/stores/ui-state';

	import { getNumberOfYearsBetweenEvents } from '$lib/utils';
	import { upgradeTimelineEvent } from '$lib/person-management';
	import { setTimelineEditEvent } from '$lib/temp-management';
	import { setFirstTimelineEventHeight, setLastTimelineEventHeight } from '$lib/ui-management';

	import { monthNames } from '$lib/components/strings';
	import stylingConstants from '$lib/components/styling-constants';

	import ImageThumbnailGroup from '$lib/components/ImageThumbnailGroup.svelte';

	export let timelineEvent; // one object to carry all event properties
	export let backgroundColor = stylingConstants.colors.activeColorSubtle; // default color, but may be overridden
	export let rowIndex;

	let eventDateCorrected;
	let eventAge;
	let eventRowDivRef;

	const onTimelineEventClickAction = () => {
		// do nothing if this is the "today" event (no death date)
		if (timelineEvent.eventType === timelineEventTypes.today.type) {
			return;
		}
		setTimelineEditEvent(timelineEvent);
	};

	let eventRowCss = css`
		gap: ${stylingConstants.sizes.timelineEventGapSize};
		&:hover {
			background-color: ${stylingConstants.colors.timelineEventBackgroundHoverColor};
		}
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
	});

	$: {
		if (timelineEvent) {
			eventDateCorrected = new Date(timelineEvent.eventDate);

			eventRowCss = css`
				${eventRowCss}
				grid-row: ${rowIndex};
			`;

			eventAge = getNumberOfYearsBetweenEvents(
				$uiState.activePerson.birth.date,
				eventDateCorrected
			);
		}
	}
</script>

<div
	class="timeline-event-row {eventRowCss}"
	role="button"
	tabindex="0"
	on:click={onTimelineEventClickAction}
	on:keydown={onTimelineEventClickAction}
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
	<div class="timeline-event-content-outer-container">
		<div class="timeline-event-title-bar {eventTitleBarCss}">
			<i class="fa-solid {timelineEventTypes[timelineEvent?.eventType]?.icon} {eventFaIconCss}" />
			<!-- hide age if this is the birth event -->
			{#if timelineEvent.eventType !== timelineEventTypes.birth.type}
				<div class="timeline-event-age {eventAgeCss}">
					{eventAge.toString() !== 'NaN' ? 'Age: ' : ''}
					{eventAge.toString() !== 'NaN' ? eventAge : ''}
				</div>
			{/if}
		</div>
		<div class="timeline-event-content {eventContentCss}">
			<div class="timeline-event-description">
				{timelineEvent?.eventContent.description
					? timelineEvent?.eventContent.description
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
		cursor: pointer;
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
		cursor: pointer;
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
</style>
