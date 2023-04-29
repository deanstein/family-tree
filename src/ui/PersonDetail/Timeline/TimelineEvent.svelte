<script>
</script>

<div id="timeline-event-row" class="timeline-event-row">
	<div id="timeline-event-node-column" class="timeline-event-node-column">
		<div id="timeline-event-node" class="timeline-event-node" />
	</div>
	<div id="timeline-event-detail-column" class="timeline-event-detail-column">
		<div id="event-detail-line" class="event-detail-line" />
		<div id="event-detail-content" class="event-detail-content" />
	</div>
</div>

<style>
	.timeline-event-row {
		display: flex;
		width: 100%;
	}

	.timeline-event-node-column {
		display: flex;
		justify-content: center;
		flex-basis: 25%;
	}

	.timeline-event-detail-column {
		display: flex;
		align-items: center;
		flex-basis: 75%;
	}

	.timeline-event-node {
		width: 2vw;
		height: 2vw;
		border-radius: 1vw;
		aspect-ratio: 1;
		background-color: black;
	}

	.event-detail-line {
		display: flex;
		width: 25%;
		height: 1vh;
		flex-basis: 25%;
		background-color: black;
	}

	.event-detail-content {
		display: flex;
		flex-basis: 25%;
	}
</style>
