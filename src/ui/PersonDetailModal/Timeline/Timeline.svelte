<script>
	import { v4 as uuidv4 } from 'uuid';

	import timelineEvent from '../../../schemas/timeline-event';
	import uiState from '../../../stores/ui-state';

	import { setTimelineEditEvent } from '../../../logic/temp-management';
	import { instantiateObject } from '../../../logic/utils';

	import Button from '../../Button.svelte';
	import TimelineEvent from './TimelineEvent.svelte';
	import TimelineSpine from './TimelineSpine.svelte';

	const onAddEventButtonClick = () => {
		const newTimelineEvent = instantiateObject(timelineEvent);
		newTimelineEvent.eventId = uuidv4();
		setTimelineEditEvent(newTimelineEvent);
	};
</script>

<div id="timeline-container" class="timeline-container">
	<div id="timeline-actions-bar" class="timeline-actions-bar">
		<Button buttonText="Add Event" onClickFunction={onAddEventButtonClick} />
	</div>
	<div id="timeline-scrolling-canvas" class="timeline-scrolling-canvas">
		<!-- always present: birth -->
		<TimelineEvent eventDate={$uiState.activePerson.birth.date} eventContent="Birth" />

		<!-- middle section for all other events -->
		<div id="timeline-center" class="timeline-center">
			<TimelineSpine />
			<div id="timeline-events-container" class="timeline-events-container">
				{#each $uiState.activePerson.timelineEvents as event}
					<TimelineEvent eventDate={event.eventDate} eventContent={event.eventContent} />
				{/each}
			</div>
		</div>

		<!-- always present: current moment or date of death -->
		<TimelineEvent
			eventDate={$uiState.activePerson.death.date !== ''
				? $uiState.activePerson.death.date
				: new Date()}
			eventContent={$uiState.activePerson.death.date !== '' ? 'Death' : 'Today'}
		/>
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
