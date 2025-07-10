<script>
	import { css } from '@emotion/css';
	import { v4 as uuidv4 } from 'uuid';

	import { activePerson } from '$lib/states/family-tree-state';
	import { showPersonDetailViewModal } from '$lib/states/ui-state';

	import { getPersonById } from '$lib/tree-management';

	import timelineEvent from '$lib/schemas/timeline-event';
	import timelineEventTypes from '$lib/schemas/timeline-event-types';
	import timelineEventOriginTypes from '$lib/schemas/timeline-event-origin-types';

	import { schemaVersion } from '$lib/versions';
	import { instantiateObject } from '$lib/utils';

	import Bio from '$lib/components/Bio/Bio.svelte';
	import Modal from '$lib/components/Modals/Modal.svelte';
	import Timeline from '$lib/components/Timeline/Timeline.svelte';
	import stylingConstants from '$lib/components/styling-constants';

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

	const onClickCloseButton = () => {
		showPersonDetailViewModal.set(false);
	};

	const personDetailModalBioContainerCss = css`
		@media (max-width: ${stylingConstants.breakpoints.width[0]}) {
		}
		@media (min-width: ${stylingConstants.breakpoints.width[0]}) and (max-height: ${stylingConstants
				.breakpoints.width[1]}) {
		}
		@media (min-width: ${stylingConstants.breakpoints.width[1]}) {
			overflow-y: auto;
		}
	`;

	const personDetailModalContentCss = css`
		@media (max-width: ${stylingConstants.breakpoints.width[0]}) {
			flex-direction: column;
		}
		@media (min-width: ${stylingConstants.breakpoints.width[0]}) and (max-height: ${stylingConstants
				.breakpoints.width[1]}) {
			flex-direction: column;
		}
		@media (min-width: ${stylingConstants.breakpoints.width[1]}) {
			flex-direction: row;
		}
	`;

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

<Modal
	showModal={$showPersonDetailViewModal}
	{onClickCloseButton}
	title={'Person Details'}
	subtitle={null}
	width={'80vw'}
	height={'80vh'}
	padding={'15px'}
	zIndex={stylingConstants.zIndices.personDetailViewZIndex}
>
	<div class="person-detail-modal-content {personDetailModalContentCss}" slot="modal-content-slot">
		<div class="person-detail-bio-container {personDetailModalBioContainerCss}">
			<Bio />
		</div>
		<div class="person-detail-timeline-container">
			<div class="person-detail-timeline-content-container">
				<Timeline
					{timelineEvents}
					{timelineEventReferences}
					{contextEvents}
					inceptionEvent={birthEvent}
					cessationEvent={deathEvent}
				/>
			</div>
		</div>
	</div>
</Modal>

<style>
	.person-detail-modal-content {
		display: flex;
		overflow-x: none;
		overflow-y: auto;
		flex-grow: 1;
		height: 100%;
		width: 100%;
		gap: 1rem;
	}

	.person-detail-bio-container {
		display: flex;
		flex-direction: column;
		flex-basis: 33.333%;
		border-radius: 10px;
	}

	.person-detail-timeline-container {
		display: flex;
		flex-direction: column;
		flex-basis: 67.667%;
	}

	.person-detail-timeline-content-container {
		display: flex;
		flex-grow: 1;
		height: -webkit-fill-available;
		width: -moz-available;
		background-color: gainsboro;
		padding: 1vh;
		border-radius: 10px;
	}
</style>
