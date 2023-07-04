<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../../styling-constants';

	const lineDynamicClass = css`
		width: ${stylingConstants.sizes.timelineSpineThickness};
		background-color: ${stylingConstants.colors.textColor};
	`;

	const lineColumnDynamicClass = css`
		margin-left: ${stylingConstants.sizes.nTimelineEventNodeSize / 2 +
		stylingConstants.sizes.nTimelineEventGapSize * 2 +
		stylingConstants.sizes.nTimelineEventYearWidth -
		stylingConstants.sizes.nTimelineSpineLineThickness / 2 +
		'vw'};
	`;
</script>

<div id="timeline-spine-row" class="timeline-spine-row">
	<div id="timeline-spine-line-column" class="{lineColumnDynamicClass} timeline-spine-line-column">
		<div id="timeline-spine-line" class="{lineDynamicClass} timeline-spine-line" />
	</div>
</div>

<style>
	.timeline-spine-row {
		position: absolute;
		display: flex;
		height: 100%;
		width: 100%;
	}

	.timeline-spine-line-column {
		display: flex;
	}
</style>
