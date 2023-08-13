<script>
	import { css } from '@emotion/css';

	import uiState from '../../../../stores/ui-state';

	import stylingConstants from '../../../styling-constants';
	import { getTimelineProportionByDate } from '../../../../logic/ui-management';
	import { setTimelineEditEvent } from '../../../../logic/temp-management';

	export let timelineEvent = undefined; // one object to carry all event properties
	let eventDateCorrected;
	let eventTimelineProportion; // parameter 0-1 of the position on the timeline

	let eventRowDynamicClass;

	const onTimelineEventClickAction = () => {
		setTimelineEditEvent(timelineEvent);
	};

	const eventYearDynamicClass = css`
		margin-left: ${stylingConstants.sizes.timelineEventGapSize};
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
		if (timelineEvent) {
			eventDateCorrected = new Date(timelineEvent.eventDate);
			eventTimelineProportion = getTimelineProportionByDate(
				$uiState.activePerson,
				timelineEvent.eventDate
			);

			eventRowDynamicClass = css`
				gap: ${stylingConstants.sizes.timelineEventGapSize};
				top: ${eventTimelineProportion < 0.9 ? eventTimelineProportion * 100 + '%' : 'auto'};
				bottom: ${eventTimelineProportion < 0.9 ? 'auto' : 0};
			`;
		}
	}

	const eventContentDynamicClass = css`
		background-color: ${stylingConstants.colors.activeColorSubtle};
		:hover {
			background-color: ${stylingConstants.colors.hoverColorSubtle};
		}
	`;
</script>

<div id="timeline-event-row" class="{eventRowDynamicClass} timeline-event-row">
	<div id="timeline-event-year" class="{eventYearDynamicClass} timeline-event-year">
		{eventDateCorrected.toString() !== 'Invalid Date'
			? eventDateCorrected.getUTCFullYear()
			: 'Year Unknown'}
	</div>
	<div id="timeline-event-node" class="{eventNodeDynamicClass} timeline-event-node" />
	<div id="event-detail-line" class="{eventDetailLineDynamicClass} event-detail-line" />
	<div
		id="event-detail-content"
		class="{eventContentDynamicClass} event-detail-content"
		on:click={onTimelineEventClickAction}
	>
		{timelineEvent?.eventContent ? timelineEvent?.eventContent : 'Event details'}
	</div>
</div>

<style>
	.timeline-event-row {
		position: absolute;
		max-width: 100%;
		display: flex;
		align-items: center;
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
		width: 2vw;
	}

	.event-detail-content {
		/* display: flex; */ /* TODO: make separate text layout and truncate that */
		flex: 1;
		flex-shrink: 1;
		padding: 3px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
</style>
