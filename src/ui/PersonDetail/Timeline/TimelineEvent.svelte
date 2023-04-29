<script>
</script>

<div id="timeline-event-row" class="timeline-event-row">
	<div id="timeline-event-node-column" class="timeline-event-node-column">
		<div id="timeline-event-node" class="timeline-event-node" />
	</div>
	<div id="timeline-event-detail-column" class="timeline-event-detail-column" />
</div>

<style>
	.timeline-event-row {
		display: flex;
	}

	.timeline-event-node-column {
		display: flex;
		justify-content: center;
		background-color: red;
		flex-basis: 25%;
	}

	.timeline-event-detail-column {
		background-color: blue;
		flex-basis: 75%;
	}

	.timeline-event-node {
		width: 2vw;
		height: 2vw;
		border-radius: 1vw;
		aspect-ratio: 1;
		background-color: black;
	}
</style>
