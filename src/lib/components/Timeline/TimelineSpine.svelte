<script>
	import { css } from '@emotion/css';

	import uiState from '$lib/stores/ui-state';

	import stylingConstants from '$lib/components/styling-constants';

	let lineDynamicClass = css`
		width: ${stylingConstants.sizes.timelineSpineThickness};
		background-color: ${stylingConstants.colors.timelineSpineColor};
	`;

	const lineColumnDynamicClass = css`
		margin-left: ${stylingConstants.sizes.nTimelineEventNodeSize / 2 +
		stylingConstants.sizes.nTimelineEventGapSize * 2 +
		stylingConstants.sizes.nTimelineEventYearWidth -
		stylingConstants.sizes.nTimelineSpineLineThickness / 2 +
		'vw'};
	`;

	$: {
		lineDynamicClass = css`
			${lineDynamicClass}
			margin-top: ${$uiState.timelineCanvasScrollState.top
				? $uiState.timelineFirstEventHeight / 2 + 'px'
				: 0};
			margin-bottom: ${$uiState.timelineCanvasScrollState.bottom
				? $uiState.timelineLastEventHeight / 2 + 'px'
				: 0};
		`;
	}
</script>

<div class="timeline-spine">
	<div class="{lineColumnDynamicClass} timeline-spine-line-column">
		<div class="{lineDynamicClass} timeline-spine-line" />
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
