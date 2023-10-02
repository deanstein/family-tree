<script>
	import { v4 as uuidv4 } from 'uuid';

	import { css } from '@emotion/css';

	import stylingConstants from '../../../styling-constants';
	import timelineEventTypes from '../../../../schemas/timeline-event-types';
	import timelineEvent from '../../../../schemas/timeline-event';
	import uiState from '../../../../stores/ui-state';
	import { schemaVersion } from '../../../../versions';

	import { setTimelineEditEvent, setTimelineEditEventId } from '../../../../logic/temp-management';
	import {
		generateTimelineRowItems,
		updateTimelineRowItems
	} from '../../../../logic/ui-management';
	import { instantiateObject } from '../../../../logic/utils';

	import Button from '../../../Button.svelte';
	import Checkbox from '../../../Checkbox.svelte';
	import TimelineEvent from './TimelineEvent.svelte';
	import TimelineSpineCanvas from './TimelineSpineCanvas.svelte';

	// if true, the timeline is spaced out
	// to show relative spacing between events
	let forceRelativeSpacing = false;
	// row items are converted from the activePerson's raw event data
	// each row item is an object with the index and the event content
	let timelineRowItems = [];

	// dynamic classes using Emotion CSS
	let timelineEventGridDynamicClass;

	// define the two required events - birth and death (or today)
	const birthEvent = instantiateObject(timelineEvent);
	birthEvent.eventId = uuidv4();
	birthEvent.eventType = timelineEventTypes.birth.type;
	birthEvent.eventVersion = schemaVersion;

	const deathEvent = instantiateObject(timelineEvent);
	deathEvent.eventId = uuidv4();
	deathEvent.eventType = timelineEventTypes.death.type;
	deathEvent.eventVersion = schemaVersion;

	const onClickAddEventButton = () => {
		// birth date must be set first
		// before any normal timeline event is added
		if ($uiState.activePerson.birth.date === '') {
			setTimelineEditEvent(birthEvent);
			setTimelineEditEventId(birthEvent.eventId);
			// otherwise, add an event like normal
		} else {
			const newTimelineEvent = instantiateObject(timelineEvent);
			newTimelineEvent.eventId = uuidv4();
			setTimelineEditEvent(newTimelineEvent);
			setTimelineEditEventId(newTimelineEvent.eventId);
		}
	};

	export const onCheckRelativeSpacing = () => {
		forceRelativeSpacing = true;
	};

	export const onUncheckRelativeSpacing = () => {
		forceRelativeSpacing = false;
	};

	$: {
		// ensure birth event is kept updated
		birthEvent.eventDate = $uiState.activePerson.birth.date;
		birthEvent.eventContent = 'Born';
		// ensure death event is kept updated
		deathEvent.eventDate =
			$uiState.activePerson.death.date !== ''
				? $uiState.activePerson.death.date
				: new Date().toLocaleDateString();
		deathEvent.eventContent = $uiState.activePerson.death.date !== '' ? 'Deceased' : 'Today';

		// convert events to timeline row items
		// and ensure no shared rows in the grid
		timelineRowItems = updateTimelineRowItems(generateTimelineRowItems($uiState.activePerson));

		// ensure custom css is kept updated
		timelineEventGridDynamicClass = css`
			row-gap: ${forceRelativeSpacing ? '1px' : 'auto'};
		`;
	}
</script>

<div id="timeline-container" class="timeline-container">
	<div id="timeline-actions-bar" class="timeline-actions-bar">
		<Checkbox
			isEnabled={true}
			showLabel={true}
			label="Relative Spacing"
			isChecked={forceRelativeSpacing}
			onCheckAction={onCheckRelativeSpacing}
			onUncheckAction={onUncheckRelativeSpacing}
		/>
		<Button buttonText="Add Event" onClickFunction={onClickAddEventButton} />
	</div>
	<div id="timeline-content-container" class="timeline-content-container">
		<!-- <TimelineSpine /> -->
		<TimelineSpineCanvas
			birthEventNodePosition={$uiState.timelineFirstEventPosition}
			deathEventNodePosition={$uiState.timelineLatestEventPosition}
		/>
		<div id="timeline-scrolling-canvas" class="timeline-scrolling-canvas">
			<!-- the grid for all timeline events -->
			<div id="timeline-event-grid" class="{timelineEventGridDynamicClass} timeline-event-grid">
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
		column-gap: 1vh;
	}

	.timeline-content-container {
		display: flex;
		height: -webkit-fill-available;
		flex-grow: 1;
		overflow: hidden;
	}

	.timeline-scrolling-canvas {
		position: relative;
		height: -webkit-fill-available;
		width: -webkit-fill-available;
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
