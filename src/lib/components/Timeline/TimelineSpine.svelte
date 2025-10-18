<script>
	import { css } from '@emotion/css';

	import {
		timelineCanvasScrollState,
		timelineFirstEventHeight,
		timelineLastEventHeight
	} from '$lib/states/ui-state';

	import stylingConstants from '$lib/components/styling-constants';

	let lineCss = css`
		width: ${stylingConstants.sizes.timelineSpineThickness};
		background: linear-gradient(
			to bottom,
			rgba(255, 0, 0, 0) 0%,
			${stylingConstants.colors.timelineSpineColor} 20px,
			${stylingConstants.colors.timelineSpineColor} calc(100% - 20px),
			rgba(255, 0, 0, 0) 100%
		);
	`;

	const lineColumnCss = css`
		margin-left: ${stylingConstants.sizes.nTimelineEventNodeSize / 2 +
		stylingConstants.sizes.nTimelineEventGapSize * 2 +
		stylingConstants.sizes.nTimelineEventYearWidth -
		stylingConstants.sizes.nTimelineSpineLineThickness / 2 +
		'rem'};
	`;

	$: {
		lineCss = css`
			${lineCss}
			margin-top: ${$timelineCanvasScrollState.top ? $timelineFirstEventHeight / 2 + 'px' : 0};
			margin-bottom: ${$timelineCanvasScrollState.bottom ? $timelineLastEventHeight / 2 + 'px' : 0};
		`;
	}
</script>

<div class="timeline-spine">
	<div class="timeline-spine-line-column {lineColumnCss}">
		<div class="timeline-spine-line {lineCss}" />
	</div>
</div>

<style>
	.timeline-spine {
		position: absolute;
		display: flex;
		height: 100%;
	}

	.timeline-spine-line-column {
		display: flex;
	}
</style>
