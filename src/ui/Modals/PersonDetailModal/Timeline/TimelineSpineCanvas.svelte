<script>
	import { onMount } from 'svelte';
	import { set2DContextSize, setTimelineSpineCanvas } from '../../../../logic/ui-management';
	import { drawTimelineSpine } from '../../../graphics-factory';
	import uiState from '../../../../stores/ui-state';

	export let birthEventNodePosition;
	export let deathEventNodePosition;

	let spineCanvasRef;

	// redraw the spine on window resize
	window.addEventListener('resize', () => {
		drawTimelineSpine($uiState.timelineSpineCanvas, birthEventNodePosition, deathEventNodePosition);
	});

	onMount(() => {
		if (spineCanvasRef) {
			setTimelineSpineCanvas(spineCanvasRef);
			drawTimelineSpine(
				spineCanvasRef,
				$uiState.timelineFirstEventPosition,
				$uiState.timelineLatestEventPosition
			);
		}
	});

	$: {
		const updatedFirstEventPosition = {
			x: $uiState.timelineFirstEventPosition?.x + $uiState.timelineCompositeScrollPos?.x,
			y: $uiState.timelineFirstEventPosition?.y + $uiState.timelineCompositeScrollPos?.y
		};
		const updatedLastEventPosition = {
			x: $uiState.timelineLatestEventPosition?.x + $uiState.timelineCompositeScrollPos?.x,
			y: $uiState.timelineLatestEventPosition?.y + $uiState.timelineCompositeScrollPos?.y
		};
		drawTimelineSpine(
			$uiState.timelineSpineCanvas,
			updatedFirstEventPosition,
			updatedLastEventPosition
		);
	}
</script>

<canvas id="timeline-spine-canvas" class="timeline-spine-canvas" bind:this={spineCanvasRef} />

<style>
	.timeline-spine-canvas {
		position: fixed;
		top: 0;
		left: 0;
		pointer-events: none;
	}
</style>
