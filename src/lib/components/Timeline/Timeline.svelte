<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { v4 as uuidv4 } from 'uuid';
	import { css } from '@emotion/css';

	import timelineEventTypes from '$lib/schemas/timeline-event-types';
	import timelineEvent from '$lib/schemas/timeline-event';

	import { timelineEditEvent, timelineEditEventId } from '$lib/states/temp-state';
	import { activePerson } from '$lib/states/ui-state';

	// @ts-expect-error
	import { getMaxElementHeightPx } from 'jdg-ui-svelte/jdg-utils.js';

	import { schemaVersion } from '$lib/versions';
	import { generateTimelineRowItems, updateTimelineRowItems } from '$lib/ui-management';
	import { instantiateObject } from '$lib/utils';

	import stylingConstants from '$lib/components/styling-constants';

	import Button from '$lib/components/Button.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import TimelineEvent from '$lib/components/Timeline/Event/TimelineEvent.svelte';
	import TimelineSpine from '$lib/components/Timeline/TimelineSpine.svelte';
	import { generateGradient } from '../graphics-factory';

	let scrollingCanvasDivRef;

	// if true, the timeline is spaced out
	// to show relative spacing between events
	let forceRelativeSpacing = false;
	// row items are converted from the activePerson's raw event data
	// each row item is an object with the index and the event content
	let timelineRowItems = [];

	// timeline events will each have a slightly different color
	// along a gradient defined here
	let timelineEventColors = [];

	// dynamic classes using Emotion CSS
	let timelineEventGridCss;
	const timelineEventCountCss = css`
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
		if (!get(activePerson).birth.date) {
			timelineEditEventId.set(birthEvent);
			timelineEditEventId.set(birthEvent.eventId);
			// otherwise, add an event like normal
		} else {
			const newTimelineEvent = instantiateObject(timelineEvent);
			newTimelineEvent.eventId = uuidv4();
			newTimelineEvent.eventVersion = schemaVersion;
			newTimelineEvent.eventType = timelineEventTypes.generic.type;
			timelineEditEvent.set(newTimelineEvent);
			timelineEditEventId.set(newTimelineEvent.eventId);
		}
	};

	export const onCheckRelativeSpacing = () => {
		forceRelativeSpacing = true;
	};

	export const onUncheckRelativeSpacing = () => {
		forceRelativeSpacing = false;
	};

	let eventsInView = [];
	onMount(() => {
		// determine whether the spacing should default to relative
		const timelineHeightPx = getMaxElementHeightPx(scrollingCanvasDivRef);
		const emptyRowHeightPx = stylingConstants.sizes.nTimelineEventEmptyRowHeight;

		// set relative spacing to true if at least 5 events would appear
		const minEventsInView = 5;
		for (let i = 0; i < timelineRowItems.length; i++) {
			const rowItem = timelineRowItems[i];
			const rowYPosPx =
				rowItem.index * emptyRowHeightPx +
				(eventsInView.length + 1 * stylingConstants.sizes.nTimelineEventFilledRowHeight);
			if (rowYPosPx < timelineHeightPx) {
				eventsInView.push(rowItem.index);
			}
			if (eventsInView.length > minEventsInView) {
				forceRelativeSpacing = true;
				break;
			}
		}
	});

	// keep timeline row items updated
	$: {
		// convert events to timeline row items
		// and ensure no shared rows in the grid
		timelineRowItems = updateTimelineRowItems(generateTimelineRowItems($activePerson));
	}

	// ensure birth and death dates are updated
	$: {
		birthEvent.eventDate = $activePerson.birth.date;
		birthEvent.eventContent.description = 'Born';
		// ensure death event is kept updated
		deathEvent.eventType = $activePerson.death.date
			? timelineEventTypes.death.type
			: timelineEventTypes.today.type;
		deathEvent.eventDate = $activePerson.death.date
			? $activePerson.death.date
			: new Date().toLocaleDateString();
		deathEvent.eventContent.description = $activePerson.death.date !== '' ? 'Deceased' : 'Today';

		// generate a gradient of colors across all timeline events
		timelineEventColors = generateGradient(
			$activePerson?.timelineEvents?.length + 2 /* account for birth and death */,
			stylingConstants.colors.timelineEventBackgroundColorGradient1,
			stylingConstants.colors.timelineEventBackgroundColorGradient2,
			stylingConstants.colors.timelineEventBackgroundColorGradient3
		);

		// ensure custom css is kept updated
		timelineEventGridCss = css`
			row-gap: ${forceRelativeSpacing
				? stylingConstants.sizes.timelineEventEmptyRowHeight
				: 'auto'};
		`;
	}
</script>

<div class="timeline-container">
	<div class="timeline-actions-bar">
		<div class="timeline-event-count {timelineEventCountCss}">
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
	<div class="timeline-content-container">
		<TimelineSpine />
		<div class="timeline-scrolling-canvas" bind:this={scrollingCanvasDivRef}>
			<!-- the grid containing all timeline events -->
			<div class="timeline-event-grid {timelineEventGridCss}">
				<!-- always present and always at the top: birth -->
				<TimelineEvent
					timelineEvent={birthEvent}
					rowIndex={0}
					backgroundColor={timelineEventColors[0]}
				/>

				<!-- all other timeline events saved to the person -->
				{#each timelineRowItems as timelineRowItem, i}
					<TimelineEvent
						timelineEvent={timelineRowItem.event}
						rowIndex={timelineRowItem.index}
						backgroundColor={timelineEventColors[i + 1]}
						eventReference={timelineRowItem.eventReference}
					/>
				{/each}

				<!-- always present: current date or date of death -->
				<TimelineEvent
					timelineEvent={deathEvent}
					rowIndex={stylingConstants.quantities.initialTimelineRowCount}
					backgroundColor={timelineEventColors[timelineEventColors.length - 1]}
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
