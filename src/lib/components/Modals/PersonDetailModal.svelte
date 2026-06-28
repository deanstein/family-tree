<script>
	import { v4 as uuidv4 } from 'uuid';

	import { activePerson } from '$lib/states/family-tree-state';
	import { showPersonDetailViewModal } from '$lib/states/ui-state';

	import { getPersonById } from '$lib/tree-management';

	import timelineEvent from '$lib/schemas/timeline-event';
	import timelineEventTypes from '$lib/schemas/timeline-event-types';
	import timelineEventOriginTypes from '$lib/schemas/timeline-event-origin-types';

	import { schemaVersion } from '$lib/versions';
	import { instantiateObject } from '$lib/utils';

	import {
		isDesktopBreakpoint,
		JDGButton,
		JDGModal,
		JDGNotificationBanner,
		JDGTimeline,
		JDG_NOTIFICATION_TYPES
	} from 'jdg-ui-svelte';
	import Bio from '$lib/components/Bio/Bio.svelte';
	import Timeline from '$lib/components/Timeline/Timeline.svelte';

	// TEMP: toggle between the legacy Family Tree timeline (v1)
	// and the new JDGTimeline from jdg-ui-svelte (v2).
	// Defaults to the legacy timeline until the data structure is migrated.
	let timelineVersion = 'v1';
	const toggleTimelineVersion = () => {
		timelineVersion = timelineVersion === 'v1' ? 'v2' : 'v1';
	};

	// TEMP: the new JDGTimeline expects a `timelineHost` object.
	// The Family Tree data hasn't been migrated to that shape yet,
	// so pass null to render the new timeline's empty-state gracefully.
	const v2TimelineHost = null;

	// set up the birth event with its static fields
	const birthEvent = instantiateObject(timelineEvent);
	birthEvent.eventId = uuidv4();
	birthEvent.eventType = timelineEventTypes.birth.type;
	birthEvent.eventVersion = schemaVersion;
	birthEvent.eventContent.description = 'Born';
	// set up the death event with its static fields - if not deceased, this is today
	const deathEvent = instantiateObject(timelineEvent);
	deathEvent.eventId = uuidv4();
	deathEvent.eventVersion = schemaVersion;

	// get the events and references from the active person
	$: timelineEvents = $activePerson?.timelineEvents;
	$: timelineEventReferences = $activePerson?.timelineEventReferences;
	$: contextEvents = (() => {
		let events = [];
		// add child birth event(s)
		const children = $activePerson.relationships?.children ?? [];
		for (const rel of children) {
			const child = getPersonById(rel.id);
			const childBirth = child?.birth?.date;
			if ($activePerson.birth?.date && childBirth) {
				const event = instantiateObject(timelineEvent);
				event.eventType = timelineEventTypes.childBirth.type;
				event.eventDate = childBirth;
				event.eventContent.description = `${child.name} was born`;
				event.originType = timelineEventOriginTypes.contextual;
				event.originMeta = { personId: rel.id };
				events.push(event);
			}
		}

		// add parent death event(s)
		const parents = $activePerson.relationships?.parents ?? [];
		for (const rel of parents) {
			const parent = getPersonById(rel.id);
			const parentDeath = parent?.death?.date;
			if ($activePerson.birth?.date && parentDeath) {
				const event = instantiateObject(timelineEvent);
				event.eventType = timelineEventTypes.parentDeath.type;
				event.eventDate = parentDeath;
				event.originType = timelineEventOriginTypes.contextual;
				event.eventContent.description = `${parent.name} died`;
				event.originMeta = { personId: rel.id };
				events.push(event);
			}
		}
		return events;
	})();

	// stacked layout (mobile + tablet): fixed timeline height; side-by-side (desktop): fill modal
	$: timelineHeight = $isDesktopBreakpoint ? undefined : '90svh';

	const onClickCloseButton = () => {
		showPersonDetailViewModal.set(false);
	};

	// generate timeline events for the timeline from the active person
	$: {
		// ensure birth event is kept updated
		birthEvent.eventDate = $activePerson.birth.date;
		// ensure death event is kept updated
		deathEvent.eventType = $activePerson.death.date
			? timelineEventTypes.death.type
			: timelineEventTypes.today.type;
		deathEvent.eventDate = $activePerson.death.date
			? $activePerson.death.date
			: new Date().toLocaleDateString();
		deathEvent.eventContent.description = $activePerson.death.date !== '' ? 'Deceased' : 'Today';
	}
</script>

<JDGModal
	{onClickCloseButton}
	title={'Person Details'}
	width={'80vw'}
	height={'80dvh'}
	padding={'15px'}
	transparency={0.7}
	overflow={$isDesktopBreakpoint ? 'hidden' : 'auto'}
>
	<div class="person-detail-modal-content" slot="modal-content-slot">
		<div class="person-detail-bio-container">
			<Bio anchorComposeToBottom={$isDesktopBreakpoint} />
		</div>
		<div class="person-detail-timeline-container">
			<JDGNotificationBanner
				notificationType={JDG_NOTIFICATION_TYPES.information}
				message={timelineVersion === 'v1'
					? 'A new timeline is coming! This is the legacy one.'
					: "This is the new timeline. It's a work in progress."}
				showCloseButton={false}
			>
				<JDGButton
					label={timelineVersion === 'v1' ? 'Switch to new' : 'Switch to legacy'}
					faIcon={'fa-arrows-rotate'}
					onClickFunction={toggleTimelineVersion}
					paddingTopBottom={'3px'}
					paddingLeftRight={'8px'}
				/>
			</JDGNotificationBanner>
			{#if timelineVersion === 'v1'}
				<Timeline
					{timelineEvents}
					{timelineEventReferences}
					{contextEvents}
					inceptionEvent={birthEvent}
					cessationEvent={deathEvent}
					height={timelineHeight}
					anchorComposeToBottom={$isDesktopBreakpoint}
				/>
			{:else}
				<JDGTimeline
					timelineHost={v2TimelineHost}
					allowEditing={false}
					isInteractive={false}
					minHeight={timelineHeight ?? '100%'}
					maxHeight={timelineHeight ?? '100%'}
				/>
			{/if}
		</div>
	</div>
</JDGModal>

<style>
	/* stacked (mobile / tablet): natural height so the modal content slot can scroll */
	.person-detail-modal-content {
		display: flex;
		flex-direction: column;
		flex-shrink: 0;
		width: 100%;
		gap: 1rem;
	}

	.person-detail-bio-container {
		display: flex;
		flex-direction: column;
		width: 100%;
	}

	.person-detail-timeline-container {
		display: flex;
		flex-direction: column;
		width: 100%;
		gap: 1vh;
	}

	/* stacked (mobile / tablet): honor explicit timeline height — do not shrink */
	.person-detail-timeline-container > :global(:last-child) {
		flex: none;
	}

	/* desktop: side-by-side with a fixed height; the timeline scrolls
	   internally and there's no outer scrollbar */
	@media (min-width: 1024px) {
		.person-detail-modal-content {
			flex-direction: row;
			flex: 1 1 0;
			flex-shrink: 1;
			min-height: 0;
			max-height: 100%;
			height: 100%;
			overflow: hidden;
		}

		.person-detail-bio-container {
			flex: 1 1 33.333%;
			min-height: 0;
			overflow: hidden;
		}

		.person-detail-timeline-container {
			flex: 1 1 67.667%;
			min-height: 0;
			overflow: hidden;
		}

		.person-detail-timeline-container > :global(:last-child) {
			flex: 1 1 0;
			min-height: 0;
			min-width: 0;
		}
	}
</style>
