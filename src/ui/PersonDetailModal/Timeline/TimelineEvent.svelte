<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../../styling-constants';

	export let eventDate;
	export let eventDateCorrected = new Date(eventDate);

	const eventRowDynamicClass = css`
		gap: ${stylingConstants.sizes.timelineEventGapSize};
	`;

	const eventYearDynamicClass = css`
		width: ${stylingConstants.sizes.timelineEventYearWidth};
	`;

	const eventNodeDynamicClass = css`
		height: ${stylingConstants.sizes.timelineEventNodeSize};
	`;
</script>

<div id="timeline-event-row" class="{eventRowDynamicClass} timeline-event-row">
	<div id="timeline-event-year" class="{eventYearDynamicClass} timeline-event-year">
		{eventDateCorrected.toString() !== 'Invalid Date'
			? eventDateCorrected.getUTCFullYear()
			: '????'}
	</div>
	<div id="timeline-event-node" class="{eventNodeDynamicClass} timeline-event-node" />
	<div id="event-detail-line" class="event-detail-line" />
	<div id="event-detail-content" class="event-detail-content">Event details</div>
</div>

<style>
	.timeline-event-row {
		display: flex;
		align-items: center;
		width: 100%;
	}

	.timeline-event-year {
		margin-left: 1vw;
		text-align: center;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.timeline-event-node {
		border-radius: 1vw;
		aspect-ratio: 1;
		background-color: black;
	}

	.event-detail-line {
		display: flex;
		height: 0.5vh;
		width: 3vw;
		background-color: black;
	}

	.event-detail-content {
		display: flex;
		flex-basis: 25%;
	}
</style>
