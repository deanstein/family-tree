<script>
</script>

<div id="timeline-spacer-row" class="timeline-spacer-row">
	<div id="timeline-spacer-line-column" class="timeline-spacer-line-column">
		<div id="timeline-spacer-line" class="timeline-spacer-line" />
	</div>
	<div id="timeline-spacer-add-event-column" class="timeline-spacer-add-event-column" />
</div>

<style>
	.timeline-spacer-row {
		display: flex;
	}

	.timeline-spacer-line-column {
		display: flex;
		justify-content: center;
		background-color: red;
		flex-basis: 25%;
	}

	.timeline-spacer-add-event-column {
		background-color: blue;
		flex-basis: 75%;
	}

	.timeline-spacer-line {
		width: 0.5vw;
		height: 5vh;
		background-color: black;
	}
</style>
