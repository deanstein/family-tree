<script>
	import { css } from '@emotion/css';
	import { onMount } from 'svelte';

	import { monthNames } from '../../../strings';
	import stylingConstants from '../../../styling-constants';
	import { setTimelineEditEvent } from '../../../../logic/temp-management';
	import {
		trySetFirstOrLatestTimelineEventPosition,
		upgradeTimelineEvent
	} from '../../../../logic/ui-management';
	import timelineEventTypes from '../../../../schemas/timeline-event-types';
	import uiState from '../../../../stores/ui-state';

	export let timelineEvent = undefined; // one object to carry all event properties
	export let rowIndex;

	let eventNodeRef; // the div element of the circular node for this event on the timeline
	let eventDateCorrected;
	let eventFaIcon = 'fa-rectangle-list'; // temporary; TODO: make this per event type

	const onTimelineEventClickAction = () => {
		// do nothing if this is the "today" event (no death date)
		if (
			timelineEvent.eventType === timelineEventTypes.death.type &&
			$uiState.activePerson.death.date === ''
		) {
			return;
		}
		upgradeTimelineEvent(timelineEvent);
		setTimelineEditEvent(timelineEvent);
	};

	let eventRowDynamicClass = css`
		gap: ${stylingConstants.sizes.timelineEventGapSize};
		&:hover {
			background-color: ${stylingConstants.colors.rowHoverColor};
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

	const eventFaIconDynamicClass = css`
		color: ${stylingConstants.colors.textColor};
	`;

	const eventTextDynamicClass = css`
		background-color: ${stylingConstants.colors.activeColorSubtle};
	`;

	$: {
		if (timelineEvent) {
			eventDateCorrected = new Date(timelineEvent.eventDate);

			eventRowDynamicClass = css`
				${eventRowDynamicClass}
				grid-row: ${rowIndex};
			`;
		}
	}

	onMount(() => {
		trySetFirstOrLatestTimelineEventPosition(timelineEvent.eventType, eventNodeRef);
	});

	window.addEventListener('resize', () => {
		trySetFirstOrLatestTimelineEventPosition(timelineEvent.eventType, eventNodeRef);
	});
</script>

<div
	id="timeline-event-row"
	class="{eventRowDynamicClass} timeline-event-row"
	on:click={onTimelineEventClickAction}
	on:keydown={onTimelineEventClickAction}
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
	<div
		id="timeline-event-node"
		class="{eventNodeDynamicClass} timeline-event-node"
		bind:this={eventNodeRef}
	/>
	<div
		id="timeline-event-detail-line"
		class="{eventDetailLineDynamicClass} timeline-event-detail-line"
	/>
	<div id="timeline-event-detail-content" class="timeline-event-detail-content">
		<i class="{eventFaIconDynamicClass} fa-solid {eventFaIcon}" />
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

	.timeline-event-detail-line {
		display: flex;
		height: 0.5vh;
		width: 2vw;
	}

	/* font awesome icon */
	.fa-solid {
		display: flex;
		align-items: center;
		font-size: 20px;
	}

	.timeline-event-detail-content {
		display: flex;
		gap: 10px;
		flex-basis: 0;
		flex-grow: 1;
		flex-shrink: 1;
		padding: 3px;
		overflow: hidden;
		text-overflow: ellipsis;
		cursor: pointer;
	}

	.timeline-event-text {
		padding: 0 5px 0 5px;
		border-radius: 5px;
	}
</style>
