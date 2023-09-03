<script>
	import { v4 as uuidv4 } from 'uuid';

	import timelineEvent from '../../../../schemas/timeline-event';
	import uiState from '../../../../stores/ui-state';

	import { setTimelineEditEvent, setTimelineEditEventId } from '../../../../logic/temp-management';
	import { instantiateObject } from '../../../../logic/utils';

	import Button from '../../../Button.svelte';
	import TimelineEvent from './TimelineEvent.svelte';
	import TimelineSpine from './TimelineSpine.svelte';
	import {
		generateTimelineRowItems,
		updateTimelineRowItems
	} from '../../../../logic/ui-management';
	import stylingConstants from '../../../styling-constants';

	// row items are converted from the activePerson's raw event data
	let timelineRowItems = [];

	// define the two required events - birth and death
	const birthEvent = instantiateObject(timelineEvent);
	const deathEvent = instantiateObject(timelineEvent);

	const onAddEventButtonClick = () => {
		const newTimelineEvent = instantiateObject(timelineEvent);
		newTimelineEvent.eventId = uuidv4();
		setTimelineEditEvent(newTimelineEvent);
		setTimelineEditEventId(newTimelineEvent.eventId);
	};

	$: {
		// ensure birth and death events are kept updated
		birthEvent.eventDate = $uiState.activePerson.birth.date;
		birthEvent.eventContent = 'Born';
		deathEvent.eventDate =
			$uiState.activePerson.death.date !== '' ? $uiState.activePerson.death.date : new Date();
		deathEvent.eventContent = $uiState.activePerson.death.date !== '' ? 'Deceased' : 'Today';
	}

	$: {
		// convert events to timeline row items
		// and ensure no shared rows in the grid
		timelineRowItems = updateTimelineRowItems(generateTimelineRowItems($uiState.activePerson));
	}
</script>

<div id="timeline-container" class="timeline-container">
	<div id="timeline-actions-bar" class="timeline-actions-bar">
		<Button buttonText="Add Event" onClickFunction={onAddEventButtonClick} />
	</div>
	<div id="timeline-content-container" class="timeline-content-container">
		<TimelineSpine />
		<div id="timeline-scrolling-canvas" class="timeline-scrolling-canvas">
			<!-- the vertical line for the timeline -->
			<div id="timeline-event-grid" class="timeline-event-grid">
				<!-- always present and always at the top: birth -->
				<TimelineEvent timelineEvent={birthEvent} rowIndex={0} />

				<!-- all other timeline events saved to the person -->
				{#each timelineRowItems as timelineRowItem}
					<TimelineEvent timelineEvent={timelineRowItem.event} rowIndex={timelineRowItem.index} />
				{/each}

				<!-- always present: current date or date of death -->
				<TimelineEvent
					timelineEvent={deathEvent}
					rowIndex={stylingConstants.quantities.initialTimelineRowCount}
				/>
			</div>
		</div>
	</div>
</div>

<style>
	.timeline-container {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		gap: 1vh;
	}

	.timeline-actions-bar {
		display: flex;
		justify-content: right;
	}

	.timeline-content-container {
		position: relative;
		display: flex;
		height: -webkit-fill-available;
		flex-grow: 1;
		overflow: hidden;
	}

	.timeline-scrolling-canvas {
		position: relative;
		height: -webkit-fill-available;
		width: -moz-available;
		display: flex;
		overflow: auto;
	}

	.timeline-event-grid {
		display: grid;
		grid-template-columns: 1fr;
		flex-grow: 1;
	}
</style>
