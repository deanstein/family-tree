<script>
	import uiState from '../../../stores/ui-state';

	import Button from '../../Button.svelte';
	import TimelineEvent from './TimelineEvent.svelte';
	import TimelineSpacer from './TimelineSpacer.svelte';

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
			<TimelineEvent eventDate="01-02-1970" />
			<TimelineSpacer />
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
</style>
