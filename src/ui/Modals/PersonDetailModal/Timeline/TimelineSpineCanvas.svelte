<script>
	import { onMount } from 'svelte';
	import { clearCanvas, set2DContextSize } from '../../../../logic/ui-management';
	import { drawLineBetweenPoints } from '../../../graphics-factory';
	import stylingConstants from '../../../styling-constants';
	import { css } from '@emotion/css';

	export let birthEventNodePosition;
	export let deathEventNodePosition;

	let spineCanvasRef;
	let spineCanvasRefContext2d;

	let spineCanvasRefDynamicClass = css`
		top: -${window.scrollY}px;
		left: -${window.scrollX}px;
	`;

	const drawTimelineSpine = () => {
		clearCanvas(spineCanvasRef);
		console.log(birthEventNodePosition, deathEventNodePosition);
		drawLineBetweenPoints(
			spineCanvasRefContext2d,
			birthEventNodePosition,
			deathEventNodePosition,
			stylingConstants.sizes.nTimelineSpineCanvasLineThickness,
			stylingConstants.colors.timelineSpineColor
		);
	};

	// redraw the spine on window resize
	window.addEventListener('resize', () => {
		set2DContextSize(spineCanvasRef, window.innerWidth, window.innerHeight, 1);
		drawTimelineSpine();
	});

	// ensure the spine scrolls with the window
	window.addEventListener('scroll', () => {
		spineCanvasRefDynamicClass = css`
			top: -${window.scrollY}px;
			left: -${window.scrollX}px;
		`;
		drawTimelineSpine();
	});

	onMount(() => {
		if (spineCanvasRef) {
			spineCanvasRefContext2d = spineCanvasRef.getContext('2d');
			set2DContextSize(spineCanvasRef, window.innerWidth, window.innerHeight, 1);
		}
		drawTimelineSpine();
	});

	$: {
		if (spineCanvasRefContext2d && birthEventNodePosition && deathEventNodePosition) {
			drawTimelineSpine();
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
