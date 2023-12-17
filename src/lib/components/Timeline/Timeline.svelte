<script>
	import { onMount } from 'svelte';
	import { v4 as uuidv4 } from 'uuid';
	import { css } from '@emotion/css';

	import stylingConstants from '../styling-constants';

	import timelineEventTypes from '$lib/schemas/timeline-event-types';
	import timelineEvent from '$lib/schemas/timeline-event';

	import uiState from '$lib/stores/ui-state';

	import { schemaVersion } from '$lib/versions';
	import {
		generateTimelineRowItems,
		setTimelineCanvasScrollState,
		updateTimelineRowItems
	} from '$lib/ui-management';
	import { instantiateObject } from '$lib/utils';
	import { setTimelineEditEvent, setTimelineEditEventId } from '$lib/temp-management';

	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import TimelineEvent from '$lib/components/Timeline/Event/TimelineEvent.svelte';
	import TimelineSpine from '$lib/components/Timeline/TimelineSpine.svelte';

	let scrollingCanvasDivRef;

	// if true, the timeline is spaced out
	// to show relative spacing between events
	let forceRelativeSpacing = false;
	// row items are converted from the activePerson's raw event data
	// each row item is an object with the index and the event content
	let timelineRowItems = [];

	// dynamic classes using Emotion CSS
	let timelineEventGridDynamicClass;
	const timelineEventCountDynamicClass = css`
		font-size: ${stylingConstants.sizes.bioFieldFontSize};
		margin-left: ${stylingConstants.sizes.timelineEventGapSize};
	`;

	// set up the birth event with its static fields
	// note that other fields are updated dynamically in a reactive block below
	const birthEvent = instantiateObject(timelineEvent);
	birthEvent.eventId = uuidv4();
	birthEvent.eventType = timelineEventTypes.birth.type;
	birthEvent.eventVersion = schemaVersion;
	// set up the death event with its static fields - if not deceased, this is today
	// note that other fields are updated dynamically in a reactive block below
	const deathEvent = instantiateObject(timelineEvent);
	deathEvent.eventId = uuidv4();
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
			newTimelineEvent.eventVersion = schemaVersion;
			newTimelineEvent.eventType = timelineEventTypes.generic.type;
			setTimelineEditEvent(newTimelineEvent);
			setTimelineEditEventId(newTimelineEvent.eventId);
		}
	};

	export const onCheckRelativeSpacing = () => {
		forceRelativeSpacing = true;
		// wait a beat for the canvas to canvas to recompute
		// before updating the scroll state
		setTimeout(() => {
			setTimelineCanvasScrollState(scrollingCanvasDivRef);
		}, 100);
	};

	export const onUncheckRelativeSpacing = () => {
		forceRelativeSpacing = false;
		// wait a beat for the canvas to canvas to recompute
		// before updating the scroll state
		setTimeout(() => {
			setTimelineCanvasScrollState(scrollingCanvasDivRef);
		}, 100);
	};

	onMount(() => {
		setTimelineCanvasScrollState(scrollingCanvasDivRef);
		scrollingCanvasDivRef.addEventListener('scroll', () => {
			setTimelineCanvasScrollState(scrollingCanvasDivRef);
		});
	});

	$: {
		// ensure birth event is kept updated
		birthEvent.eventDate = $uiState.activePerson.birth.date;
		birthEvent.eventContent.description = 'Born';
		// ensure death event is kept updated
		deathEvent.eventType =
			$uiState.activePerson.death.date !== ''
				? timelineEventTypes.death.type
				: timelineEventTypes.today.type;
		deathEvent.eventDate =
			$uiState.activePerson.death.date !== ''
				? $uiState.activePerson.death.date
				: new Date().toLocaleDateString();
		deathEvent.eventContent.description =
			$uiState.activePerson.death.date !== '' ? 'Deceased' : 'Today';

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
		<div id="timeline-event-count" class="{timelineEventCountDynamicClass} timeline-event-count">
			<!-- birth and death/today are always shown, so add 2 to the count -->
			Showing {timelineRowItems.length + 2} timeline events
		</div>
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
		<TimelineSpine />
		<div
			id="timeline-scrolling-canvas"
			class="timeline-scrolling-canvas"
			bind:this={scrollingCanvasDivRef}
		>
			<!-- the vertical line for the timeline -->
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

	.timeline-event-count {
		display: flex;
		flex-grow: 1;
		align-items: center;
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