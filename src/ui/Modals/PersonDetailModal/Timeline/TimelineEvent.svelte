<script>
	import { css } from '@emotion/css';

	import { monthNames } from '../../../strings';
	import stylingConstants from '../../../styling-constants';
	import { setTimelineEditEvent } from '../../../../logic/temp-management';

	export let timelineEvent = undefined; // one object to carry all event properties
	export let rowIndex;
	let eventDateCorrected;

	let eventRowDynamicClass;

	const onTimelineEventClickAction = () => {
		setTimelineEditEvent(timelineEvent);
	};

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

	const eventTextDynamicClass = css`
		background-color: ${stylingConstants.colors.activeColorSubtle};
		:hover {
			background-color: ${stylingConstants.colors.hoverColorSubtle};
		}
	`;

	$: {
		if (timelineEvent) {
			eventDateCorrected = new Date(timelineEvent.eventDate);

			eventRowDynamicClass = css`
				gap: ${stylingConstants.sizes.timelineEventGapSize};
				grid-row: ${rowIndex};
			`;
		}
	}
</script>

<div id="timeline-event-row" class="{eventRowDynamicClass} timeline-event-row">
	<div id="timeline-event-date-year-container" class="timeline-event-date-year-container">
		<div id="timeline-event-date" class="{eventDateDynamicClass} timeline-event-date">
			<!-- show month name with three letters like AUG -->
			{eventDateCorrected.toString() !== 'Invalid Date'
				? monthNames[eventDateCorrected.getUTCMonth()] +
				  ' ' +
				  eventDateCorrected.getUTCDate()
				: 'Date Unknown'}
		</div>
		<div id="timeline-event-year" class="{eventYearDynamicClass} timeline-event-year">
			{eventDateCorrected.toString() !== 'Invalid Date'
				? eventDateCorrected.getUTCFullYear()
				: 'Year Unknown'}
		</div>
	</div>
	<div id="timeline-event-node" class="{eventNodeDynamicClass} timeline-event-node" />
	<div
		id="timeline-timeline-event-detail-line"
		class="{eventDetailLineDynamicClass} timeline-event-detail-line"
	/>
	<div
		id="timeline-event-detail-content"
		class="timeline-event-detail-content"
		on:click={onTimelineEventClickAction}
		on:keydown={onTimelineEventClickAction}
	>
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

	.timeline-event-detail-content {
		display: flex;
		flex-basis: 0;
		flex-grow: 1;
		flex-shrink: 1;
		padding: 3px;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.timeline-event-text {
		padding: 0 5px 0 5px;
		border-radius: 5px;
	}
</style>
