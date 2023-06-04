<script>
	import { css } from '@emotion/css';

	import uiState from '../../../stores/ui-state';

	import stylingConstants from '../../styling-constants';
	import { getTimelineProportionByDate } from '../../../logic/ui-management';

	export let eventDate;
	let eventDateCorrected;
	let eventTimelineProportion; // parameter 0-1 of the position on the timeline
	let isValidEvent;

	let eventRowDynamicClass;

	const eventYearDynamicClass = css`
		width: ${stylingConstants.sizes.timelineEventYearWidth};
		color: ${stylingConstants.colors.textColor};
	`;

	const eventNodeDynamicClass = css`
		height: ${stylingConstants.sizes.timelineEventNodeSize};
		background-color: ${stylingConstants.colors.textColor};
	`;

	const eventDetailLineDynamicClass = css`
		background-color: ${stylingConstants.colors.textColor};
	`;

	$: {
		eventDateCorrected = new Date(eventDate);
		eventTimelineProportion = getTimelineProportionByDate($uiState.activePerson, eventDate);

		isValidEvent =
			eventTimelineProportion !== 0 &&
			eventTimelineProportion !== 1 &&
			eventTimelineProportion !== undefined;

		eventRowDynamicClass = css`
			position: ${isValidEvent ? 'absolute' : 'relative'};
			gap: ${stylingConstants.sizes.timelineEventGapSize};
			margin-left: ${stylingConstants.sizes.timelineEventGapSize};
			top: ${isValidEvent ? eventTimelineProportion * 100 + '%' : 'auto'};
		`;
	}
</script>

<div id="timeline-event-row" class="{eventRowDynamicClass} timeline-event-row">
	<div id="timeline-event-year" class="{eventYearDynamicClass} timeline-event-year">
		{eventDateCorrected.toString() !== 'Invalid Date'
			? eventDateCorrected.getUTCFullYear()
			: 'Year Unknown'}
	</div>
	<div id="timeline-event-node" class="{eventNodeDynamicClass} timeline-event-node" />
	<div id="event-detail-line" class="{eventDetailLineDynamicClass} event-detail-line" />
	<div id="event-detail-content" class="event-detail-content">Event details</div>
</div>

<style>
	.timeline-event-row {
		display: flex;
		align-items: center;
		width: 100%;
	}

	.timeline-event-year {
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.timeline-event-node {
		border-radius: 1vw;
		aspect-ratio: 1;
	}

	.event-detail-line {
		display: flex;
		height: 0.5vh;
		width: 3vw;
	}

	.event-detail-content {
		display: flex;
		flex-basis: 25%;
	}
</style>
