<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../../../styling-constants';
	import uiState from '../../../../stores/ui-state';

	const lineDynamicClass = css`
		margin-top: ${$uiState.timelineFirstEventHeight / 2 + 'px'};
		margin-bottom: ${$uiState.timelineLastEventHeight / 2 + 'px'};
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

<div id="timeline-spine" class="timeline-spine">
	<div id="timeline-spine-line-column" class="{lineColumnDynamicClass} timeline-spine-line-column">
		<div id="timeline-spine-line" class="{lineDynamicClass} timeline-spine-line" />
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
