<script>
	import { onMount } from 'svelte';
	import { set2DContextSize, setTimelineSpineCanvas } from '../../../../logic/ui-management';
	import { css } from '@emotion/css';
	import { drawTimelineSpine } from '../../../graphics-factory';
	import uiState from '../../../../stores/ui-state';

	export let birthEventNodePosition;
	export let deathEventNodePosition;

	let spineCanvasRef;
	let spineCanvasRefContext2d;

	let spineCanvasRefDynamicClass = css`
		top: -${window.scrollY}px;
		left: -${window.scrollX}px;
	`;

	// redraw the spine on window resize
	window.addEventListener('resize', () => {
		set2DContextSize(spineCanvasRef, window.innerWidth, window.innerHeight, 1);
		drawTimelineSpine(spineCanvasRef, birthEventNodePosition, deathEventNodePosition);
	});

	// ensure the spine scrolls with the window
	window.addEventListener('scroll', () => {
		spineCanvasRefDynamicClass = css`
			top: -${window.scrollY}px;
			left: -${window.scrollX}px;
		`;
		//drawTimelineSpine(spineCanvasRef, birthEventNodePosition, deathEventNodePosition);
	});

	onMount(() => {
		if (spineCanvasRef) {
			spineCanvasRefContext2d = spineCanvasRef.getContext('2d');
			set2DContextSize(spineCanvasRef, window.innerWidth, window.innerHeight, 1);
			setTimelineSpineCanvas(spineCanvasRef);
		}
		drawTimelineSpine(spineCanvasRef, birthEventNodePosition, deathEventNodePosition);
	});

	$: {
		// if statement only here to trigger updates when these variables run
		if (
			spineCanvasRefContext2d &&
			birthEventNodePosition &&
			deathEventNodePosition &&
			$uiState.timelineSpineCanvasScrollY
		) {
			drawTimelineSpine(spineCanvasRef, birthEventNodePosition, deathEventNodePosition);
		}
	}
</script>

<canvas
	id="timeline-spine-canvas"
	class="{spineCanvasRefDynamicClass} timeline-spine-canvas"
	bind:this={spineCanvasRef}
/>

<style>
	.timeline-spine-canvas {
		position: fixed;
		pointer-events: none;
	}
</style>
