<script>
	import { onMount } from 'svelte';

	import uiState from '../../../../stores/ui-state';
	import tempState from '../../../../stores/temp-state';

	import timelineEventTypes from '../../../../schemas/timeline-event-types';

	import {
		checkPersonForUnsavedChanges,
		setTimelineEditEventId,
		unsetTimelineEditEvent,
		unsetTimelineEditEventId
	} from '../../../../logic/temp-management';
	import { addOrReplaceTimelineEvent, deleteTimelineEvent } from '../../../../logic/person-management';

	import stylingConstants from '../../../styling-constants';

	import Button from '../../../Button.svelte';
	import DatePicker from '../Bio/DatePicker.svelte';
	import FieldContainer from '../../../FieldContainer.svelte';
	import Modal from '../../Modal.svelte';
	import ModalActionsBar from '../../ModalActionsBar.svelte';
	import Select from '../../../Select.svelte';
	import TextArea from '../../../TextArea.svelte';
	import { getObjectByKeyValue, instantiateObject } from '../../../../logic/utils';
	import timelineEvent from '../../../../schemas/timeline-event';

	let isEditable = false;
	let isKnownEvent = false;
	let eventDateInputValue = undefined;
	let eventTypeInputValue = undefined;
	let eventContentInputValue = undefined;

	const onClickEditButton = () => {
		setTimelineEditEventId($tempState.timelineEditEvent.eventId);
	};

	// cancel, but when used for editing an existing event
	const onClickCancelEditButton = () => {
		// reset the inputs - get their value from the store again
		eventDateInputValue = $tempState.timelineEditEvent.eventDate;
		eventTypeInputValue = $tempState.timelineEditEvent.eventType;
		eventContentInputValue = $tempState.timelineEditEvent.eventContent;
		unsetTimelineEditEventId();
	};

	// cancel, but when used for creating a new event
	const onClickCancelNewEventButton = () => {
		unsetTimelineEditEventId();
		unsetTimelineEditEvent();
	};

	const onClickDoneButton = () => {
		const newEventFromInputs = instantiateObject(timelineEvent);
		newEventFromInputs.eventId = $tempState.timelineEditEvent.eventId;
		newEventFromInputs.eventDate = eventDateInputValue;
		newEventFromInputs.eventType = eventTypeInputValue;
		newEventFromInputs.eventContent = eventContentInputValue;
		addOrReplaceTimelineEvent(newEventFromInputs);
		checkPersonForUnsavedChanges($uiState.activePerson.id);
		unsetTimelineEditEventId();
		unsetTimelineEditEvent();
	};

	const onClickDeleteButton = () => {
		deleteTimelineEvent($tempState.timelineEditEvent);
		checkPersonForUnsavedChanges($uiState.activePerson.id);
		unsetTimelineEditEventId();
		unsetTimelineEditEvent();
	};

	const onClickCloseButton = () => {
		unsetTimelineEditEventId();
		unsetTimelineEditEvent();
	};

	const timelineEventOptions = {
		label: 'Event types:',
		timelineEventTypes
	};

	$: {
		isEditable = $tempState.timelineEditEventId !== undefined;
		isKnownEvent = getObjectByKeyValue(
			$uiState.activePerson.timelineEvents,
			'eventId',
			$tempState.timelineEditEventId
		);
	}

	onMount(() => {
		eventDateInputValue = $tempState.timelineEditEvent.eventDate;
		eventTypeInputValue = $tempState.timelineEditEvent.eventType;
		eventContentInputValue = $tempState.timelineEditEvent.eventContent;
	});
</script>

<Modal
	showModal={$tempState.timelineEditEvent}
	title={'Event details'}
	height={stylingConstants.sizes.modalFormHeight}
	width={stylingConstants.sizes.modalFormWidth}
	subtitle={null}
	transparency={stylingConstants.colors.formBackgroundLegibleTransparency}
	zIndex={stylingConstants.zIndices.addEditAltNameZIndex}
>
	<div
		id="edit-timeline-event-modal-content"
		class="edit-timeline-event-modal-content"
		slot="modal-content-slot"
	>
		<!-- always present: event date -->
		<FieldContainer label="Event Date">
			<DatePicker isEnabled={isEditable} bind:inputValue={eventDateInputValue} />
		</FieldContainer>

		<!-- event type present for everything except birth or death -->
		{#if $tempState?.timelineEditEvent?.eventType !== timelineEventTypes.birth.type && $tempState?.timelineEditEvent?.eventType !== timelineEventTypes.death.type}
			<FieldContainer label="Event Type">
				<Select
					isEnabled={isEditable}
					bind:inputValue={eventTypeInputValue}
					optionsGroupObject={timelineEventOptions}
					optionValueKey="type"
					optionLabelKey="typeLabel"
				/>
			</FieldContainer>
		{/if}

		<!-- the rest of the content will depend on the event type -->

		<!-- birth -->
		{#if $tempState?.timelineEditEvent?.eventType === timelineEventTypes.birth.type}
			<!-- {#each timelineEvents.}
			{/each} -->
			<!-- death -->
		{:else if $tempState?.timelineEditEvent?.eventType === timelineEventTypes.death.type}
			<!-- generic content box will show if no event type or text type -->
		{:else}
			<FieldContainer label="Event Content" grow={true}>
				<TextArea isEnabled={isEditable} bind:inputValue={eventContentInputValue} />
			</FieldContainer>
		{/if}

		<ModalActionsBar>
			{#if $tempState.timelineEditEventId === undefined}
				<Button
					buttonText={'Edit'}
					onClickFunction={onClickEditButton}
					overrideBackgroundColor={stylingConstants.colors.buttonColorSecondary}
				/>
				<Button buttonText={'Close'} onClickFunction={onClickCloseButton} />
			{:else}
				{#if isKnownEvent}
					<Button
						buttonText="Delete"
						onClickFunction={onClickDeleteButton}
						overrideColor={stylingConstants.colors.buttonColorDelete}
						overrideBackgroundColor="transparent"
						overrideBackgroundColorHover="{stylingConstants.colors.buttonColorDelete};"
					/>
				{/if}
				<Button
					buttonText={'Cancel'}
					onClickFunction={isKnownEvent ? onClickCancelEditButton : onClickCancelNewEventButton}
					overrideBackgroundColor={stylingConstants.colors.buttonColorSecondary}
				/>
				<Button
					buttonText="Done"
					isEnabled={eventDateInputValue}
					onClickFunction={onClickDoneButton}
					overrideBackgroundColor={stylingConstants.colors.buttonColorDone}
				/>
			{/if}
		</ModalActionsBar>
	</div>
</Modal>

<style>
	.edit-timeline-event-modal-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex-grow: 1;
		height: 100%;
		width: 100%;
		gap: 1vh;
	}
</style>
