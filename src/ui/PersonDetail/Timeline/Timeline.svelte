<script>
	import TimelineEvent from './TimelineEvent.svelte';
	import TimelineSpacer from './TimelineSpacer.svelte';

	let events = ['born', 'deceasedOrPresent'];
</script>

<div id="timeline-scrolling-canvas" class="timeline-scrolling-canvas">
	<!-- always present: birth -->
	<TimelineEvent />

	<!-- temporary: one spacer to fill the height -->
	<div id="middle-spacer" class="middle-spacer">
		<TimelineSpacer />
	</div>

	<!-- always present: current moment or date of death -->
	<TimelineEvent />

	<!-- TODO: for each event, add an event somewhere on the timeline -->
	<!-- {#each events as event}
        <TimelineSpacer />
        <TimelineEvent />
    {/each} -->
</div>

<style>
	.timeline-scrolling-canvas {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}

	.middle-spacer {
		display: flex;
		flex-grow: 1;
		width: 100%;
	}
</style>
