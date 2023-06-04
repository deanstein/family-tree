<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../../styling-constants';

	const lineDynamicClass = css`
		width: ${stylingConstants.sizes.timelineSpineThickness};
	`;

	const lineColumnDynamicClass = css`
		margin-left: ${stylingConstants.sizes.nTimelineEventNodeSize / 2 +
		stylingConstants.sizes.nTimelineEventGapSize +
		stylingConstants.sizes.nTimelineEventYearWidth -
		stylingConstants.sizes.nTimelineSpacerLineThickness / 2 +
		'vw'};
	`;
</script>

<div id="timeline-spacer-row" class="timeline-spacer-row">
	<div
		id="timeline-spacer-line-column"
		class="{lineColumnDynamicClass} timeline-spacer-line-column"
	>
		<div id="timeline-spacer-line" class="{lineDynamicClass} timeline-spacer-line" />
	</div>
	<div id="timeline-spacer-add-event-column" class="timeline-spacer-add-event-column" />
</div>

<style>
	.timeline-spacer-row {
		position: absolute;
		display: flex;
		height: 100%;
		width: 100%;
	}

	.timeline-spacer-line-column {
		display: flex;
	}

	.timeline-spacer-add-event-column {
		flex-basis: 75%;
	}

	.timeline-spacer-line {
		background-color: black;
	}
</style>
