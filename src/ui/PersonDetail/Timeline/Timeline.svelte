<script>
	import TimelineEvent from './TimelineEvent.svelte';
	import TimelineSpacer from './TimelineSpacer.svelte';
</script>

<div id="timeline-scrolling-canvas" class="timeline-scrolling-canvas">
	<TimelineEvent />
	<TimelineSpacer />
</div>

<style>
	.timeline-scrolling-canvas {
		flex-grow: 1;
		background-color: darkgray;
	}
</style>
