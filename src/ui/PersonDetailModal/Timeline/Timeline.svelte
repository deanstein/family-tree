<script>
	import uiState from '../../../stores/ui-state';

	import Button from '../../Button.svelte';
	import TimelineEvent from './TimelineEvent.svelte';
	import TimelineSpine from './TimelineSpine.svelte';

	let events = ['born', 'deceasedOrPresent'];
</script>

<div id="timeline-container" class="timeline-container">
	<div id="timeline-actions-bar" class="timeline-actions-bar">
		<Button buttonText="Add Event" />
	</div>
	<div id="timeline-scrolling-canvas" class="timeline-scrolling-canvas">
		<!-- always present: birth -->
		<TimelineEvent eventDate={$uiState.activePerson.birth.date} />

		<!-- middle section for all other events -->
		<div id="timeline-center" class="timeline-center">
			<TimelineSpine />
			<div id="timeline-events-container" class="timeline-events-container">
				<TimelineEvent eventDate="01-02-1980" />
				<TimelineEvent eventDate="01-02-1999" />
			</div>
		</div>

		<!-- always present: current moment or date of death -->
		<TimelineEvent
			eventDate={$uiState.activePerson.death.date !== ''
				? $uiState.activePerson.death.date
				: new Date()}
		/>

		<!-- TODO: for each event, add an event somewhere on the timeline -->
		<!-- {#each events as event}
			<TimelineSpacer />
			<TimelineEvent />
		{/each} -->
	</div>
</div>

<style>
	.timeline-container {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}

	.timeline-actions-bar {
		display: flex;
		justify-content: right;
	}

	.timeline-scrolling-canvas {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}

	.timeline-center {
		position: relative;
		display: flex;
		flex-grow: 1;
		width: 100%;
	}

	.timeline-events-container {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		width: 100%;
	}
</style>
