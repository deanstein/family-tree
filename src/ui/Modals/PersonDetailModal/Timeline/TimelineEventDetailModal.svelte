<script>
	import { onMount } from 'svelte';

	import uiState from '../../../../stores/ui-state';
	import tempState from '../../../../stores/temp-state';

	import timelineEvent from '../../../../schemas/timeline-event';
	import timelineEventTypes from '../../../../schemas/timeline-event-types';

	import {
		checkPersonForUnsavedChanges,
		setTimelineEditEventId,
		unsetTimelineEditEvent,
		unsetTimelineEditEventId
	} from '../../../../logic/temp-management';
	import {
		addOrReplaceTimelineEvent,
		deleteTimelineEvent
	} from '../../../../logic/person-management';
	import { getModalTitleByEventType } from '../../../../logic/ui-management';
	import { getObjectByKeyValue, instantiateObject } from '../../../../logic/utils';
	import { timelineEventStrings } from '../../../strings';

	import stylingConstants from '../../../styling-constants';

	import Button from '../../../Button.svelte';
	import DatePicker from '../Bio/DatePicker.svelte';
	import FieldContainer from '../../../InputContainer.svelte';
	import Modal from '../../Modal.svelte';
	import ModalActionsBar from '../../ModalActionsBar.svelte';
	import Select from '../../../Select.svelte';
	import TextArea from '../../../TextArea.svelte';
	import TextInput from '../../../TextInput.svelte';

	let isNewEvent = false; // if true, this event was not found in this person's events
	let isBirthOrDeathEvent = false; // if true, this is a birth or death event which are always present but not stored as timeline events
	let isInEditMode = false; // if true, all fields will be editable

	// adjust the modal depending on the type
	let modalTitle = undefined;

	// all possible input values
	let eventDateInputValue = undefined;
	let eventTypeInputValue = undefined;
	let eventContentInputValue = undefined;
	let birthdateInputValue = undefined;
	let birthtimeInputValue = undefined;
	let birthplaceInputValue = undefined;

	const onClickEditButton = () => {
		setTimelineEditEventId($tempState.timelineEditEvent.eventId);
	};

	// cancel, but when used for editing an existing event
	// resets the inputs to match the store
	const onClickCancelEditButton = () => {
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
		modalTitle = getModalTitleByEventType($tempState?.timelineEditEvent?.eventType);
		isInEditMode = $tempState.timelineEditEventId !== undefined;
		isBirthOrDeathEvent =
			$tempState?.timelineEditEvent?.eventType === timelineEventTypes.birth.type ||
			$tempState?.timelineEditEvent?.eventType === timelineEventTypes.death.type;
		isNewEvent = !getObjectByKeyValue(
			$uiState.activePerson.timelineEvents,
			'eventId',
			$tempState.timelineEditEventId
		)
			? true
			: false;
	}

	onMount(() => {
		eventDateInputValue = $tempState.timelineEditEvent.eventDate;
		eventTypeInputValue = $tempState.timelineEditEvent.eventType;
		eventContentInputValue = $tempState.timelineEditEvent.eventContent;
	});
</script>

<Modal
	showModal={$tempState.timelineEditEvent}
	title={modalTitle}
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
		<!-- modal content will depend on the event type -->

		<!-- birth -->
		{#if $tempState?.timelineEditEvent?.eventType === timelineEventTypes.birth.type}
			<div class="side-by-side-field-container">
				<FieldContainer label={timelineEventStrings.birthdate}>
					<DatePicker
						bind:inputValue={$tempState.timelineEditEvent.eventDate}
						isEnabled={isInEditMode}
					/>
				</FieldContainer>
				<FieldContainer label={timelineEventStrings.birthtime}>
					<TextInput bind:inputValue={$uiState.activePerson.birth.time} isEnabled={isInEditMode} />
				</FieldContainer>
			</div>
			<FieldContainer label={timelineEventStrings.birthplace}>
				<TextInput bind:inputValue={$uiState.activePerson.birth.place} isEnabled={isInEditMode} />
			</FieldContainer>

			<!-- death -->
		{:else if $tempState?.timelineEditEvent?.eventType === timelineEventTypes.death.type}
			<!-- stsandard content box if no event type or generic type -->
		{:else}
			<FieldContainer label="Event Date">
				<DatePicker isEnabled={isInEditMode} bind:inputValue={eventDateInputValue} />
			</FieldContainer>
			<FieldContainer label="Event Type">
				<Select
					isEnabled={isInEditMode}
					bind:inputValue={eventTypeInputValue}
					optionsGroupObject={timelineEventOptions}
					optionValueKey="type"
					optionLabelKey="typeLabel"
				/>
			</FieldContainer>
			<FieldContainer label="Event Content" grow={true}>
				<TextArea isEnabled={isInEditMode} bind:inputValue={eventContentInputValue} />
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
				{#if !isNewEvent && !isBirthOrDeathEvent}
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
					onClickFunction={isNewEvent && !isBirthOrDeathEvent
						? onClickCancelNewEventButton
						: onClickCancelEditButton}
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

	.side-by-side-field-container {
		display: flex;
		width: -webkit-fill-available;
		width: -moz-available;
		gap: 1vh;
	}
</style>
