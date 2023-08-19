<script>
	import { v4 as uuidv4 } from 'uuid';

	import timelineEvent from '../../../../schemas/timeline-event';
	import uiState from '../../../../stores/ui-state';

	import { setTimelineEditEvent, setTimelineEditEventId } from '../../../../logic/temp-management';
	import { instantiateObject } from '../../../../logic/utils';

	import Button from '../../../Button.svelte';
	import TimelineEvent from './TimelineEvent.svelte';
	import TimelineSpine from './TimelineSpine.svelte';
	import { getClosestTimelineRowByDate } from '../../../../logic/ui-management';

	const timelineGridRowHeight = '20px';
	let timelineGridRows = Array.from({ length: 100 }, (_, i) => ({ index: i, event: null }));

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

	// needs to be fixed
	// $: {
	// 	timelineGridRows = timelineGridRows.map((row) => {
	// 		if (!row?.event) {
	// 			return;
	// 		}
	// 		console.log(row);
	// 		const closestRow = Math.ceil(
	// 			getTimelineProportionByDate($uiState.activPerson, row.event.eventDate) *
	// 				timelineGridRows.length
	// 		);
	// 		console.log(closestRow);
	// 		if (!row.event || closestRow === row.index) {
	// 			return {
	// 				...row,
	// 				event: $uiState.activePerson.timelineEvents.find(
	// 					(event) =>
	// 						Math.ceil(getTimelineProportionByDate($uiState.activePerson, event.eventDate)) ===
	// 						row.index
	// 				)
	// 			};
	// 		}

	// 		// Handle overlapping events by shifting rows down
	// 		//   for (let i = timelineGridRows.length - 2; i >= 0; i--) {
	// 		//     if (timelineGridRows[i].event && timelineGridRows[i + 1].event) {
	// 		// 		timelineGridRows[i + 1].event = timelineGridRows[i].event;
	// 		// 		timelineGridRows[i].event = null;
	// 		//     }
	// 		//   }
	// 	});
	// }
</script>

<div id="timeline-container" class="timeline-container">
	<div id="timeline-actions-bar" class="timeline-actions-bar">
		<Button buttonText="Add Event" onClickFunction={onAddEventButtonClick} />
	</div>
	<div id="timeline-scrolling-canvas" class="timeline-scrolling-canvas">
		<!-- the vertical line for the timeline -->
		<TimelineSpine />

		<!-- always present: birth -->
		<TimelineEvent timelineEvent={birthEvent} rowIndex={0} />

		<!-- show all timeline events -->
		{#each $uiState.activePerson.timelineEvents as event}
			<TimelineEvent
				timelineEvent={event}
				rowIndex={getClosestTimelineRowByDate($uiState.activePerson, event.eventDate, 100)}
			/>
		{/each}

		<!-- always present: current moment or date of death -->
		<TimelineEvent timelineEvent={deathEvent} rowIndex={timelineGridRows.length - 1} />
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
		position: relative;
		display: grid;
		grid-template-columns: 1fr;
		flex-grow: 1;
	}
</style>
