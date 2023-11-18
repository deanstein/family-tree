<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';

	import timelineEventTypes from '../../../schemas/timeline-event-types';

	import uiState from '../../../stores/ui-state';

	import { getNumberOfYearsBetweenEvents } from '../../../logic/utils';
	import { monthNames } from '../../strings';
	import stylingConstants from '../../styling-constants';

	import {
		upgradeTimelineEvent
	} from '../../../logic/person-management';

	import { setTimelineEditEvent } from '../../../logic/temp-management';
	import {
		setFirstTimelineEventHeight,
		setLastTimelineEventHeight
	} from '../../../logic/ui-management';

	export let timelineEvent = undefined; // one object to carry all event properties
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

	let eventRowDynamicClass = css`
		gap: ${stylingConstants.sizes.timelineEventGapSize};
		&:hover {
			background-color: ${stylingConstants.colors.timelineEventBackgroundHoverColor};
		}
	`;

	const eventDateDynamicClass = css`
		font-size: ${stylingConstants.sizes.timelineDateFontSize};
		margin-left: ${stylingConstants.sizes.timelineEventGapSize};
		width: ${stylingConstants.sizes.timelineEventYearWidth};
		color: ${stylingConstants.colors.textColor};
		background-color: ${stylingConstants.colors.activeColorSubtle};
	`;

	const eventYearDynamicClass = css`
		font-size: ${stylingConstants.sizes.timelineYearFontSize};
		margin-left: ${stylingConstants.sizes.timelineEventGapSize};
		width: ${stylingConstants.sizes.timelineEventYearWidth};
		color: ${stylingConstants.colors.textColor};
		background-color: ${stylingConstants.colors.activeColorSubtle};
	`;

	const eventNodeDynamicClass = css`
		height: ${stylingConstants.sizes.timelineEventNodeSize};
		background-color: ${stylingConstants.colors.textColor};
	`;

	const eventDetailLineDynamicClass = css`
		background-color: ${stylingConstants.colors.textColor};
	`;

	const eventTitleBarDynamicClass = css`
		background-color: ${stylingConstants.colors.timelineEventTitleBarColor};
	`;

	const eventFaIconDynamicClass = css`
		color: ${stylingConstants.colors.textColor};
	`;

	const EventAgeDynamicClass = css`
		color: ${stylingConstants.colors.textColor};
	`;

	const eventTextDynamicClass = css`
		background-color: ${stylingConstants.colors.activeColorSubtle};
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
			upgradeTimelineEvent(timelineEvent);

			eventDateCorrected = new Date(timelineEvent.eventDate);

			eventRowDynamicClass = css`
				${eventRowDynamicClass}
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
	id="timeline-event-row"
	class="{eventRowDynamicClass} timeline-event-row"
	on:click={onTimelineEventClickAction}
	on:keydown={onTimelineEventClickAction}
	bind:this={eventRowDivRef}
>
	<div id="timeline-event-date-year-container" class="timeline-event-date-year-container">
		<div id="timeline-event-date" class="{eventDateDynamicClass} timeline-event-date">
			<!-- show month name with three letters like AUG -->
			{eventDateCorrected.toString() !== 'Invalid Date'
				? monthNames[eventDateCorrected.getUTCMonth()] + ' ' + eventDateCorrected.getUTCDate()
				: 'Date?'}
		</div>
		<div id="timeline-event-year" class="{eventYearDynamicClass} timeline-event-year">
			{eventDateCorrected.toString() !== 'Invalid Date'
				? eventDateCorrected.getUTCFullYear()
				: 'Year?'}
		</div>
	</div>
	<div id="timeline-event-node" class="{eventNodeDynamicClass} timeline-event-node" />
	<div id="timeline-event-line" class="{eventDetailLineDynamicClass} timeline-event-line" />
	<div id="timeline-event-content" class="timeline-event-content">
		<div id="timeline-event-title-bar" class="{eventTitleBarDynamicClass} timeline-event-title-bar">
			<i
				class="{eventFaIconDynamicClass} fa-solid {timelineEventTypes[timelineEvent?.eventType]
					.icon}"
			/>
			<!-- hide age if this is the birth event -->
			{#if timelineEvent.eventType !== timelineEventTypes.birth.type}
				<div id="timeline-event-age" class="{EventAgeDynamicClass} timeline-event-age">
					{eventAge.toString() !== 'NaN' ? eventAge : ''}
				</div>
			{/if}
		</div>
		<div id="timeline-event-text" class="{eventTextDynamicClass} timeline-event-text">
			{timelineEvent?.eventContent ? timelineEvent?.eventContent : 'Event details'}
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
		border-radius: 5px 5px 0px 0px;
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

	.timeline-event-content {
		display: flex;
		flex-direction: column;
		padding: 3px;
		overflow: hidden;
		text-overflow: ellipsis;
		cursor: pointer;
	}

	.timeline-event-text {
		padding: 5px 10px 5px 10px;
		border-radius: 0px 0px 5px 5px;
	}
</style>
