<script>
	import { drawLineBetweenPoints } from '../../../graphics-factory';

	export let birthEventNodePosition;
	export let deathEventNodePosition;

	let spineCanvasRef;

	$: {
		if (spineCanvasRef) {
			drawLineBetweenPoints(
				spineCanvasRef.getContext('2d'),
				birthEventNodePosition,
				deathEventNodePosition,
				'5vw',
				'red'
			);
		}
	}
</script>

<canvas id="timeline-spine-canvas" class="timeline-spine-canvas" bind:this={spineCanvasRef} />

<style>
    .timeline-spine-canvas {
        position: absolute;
    }
</style>
