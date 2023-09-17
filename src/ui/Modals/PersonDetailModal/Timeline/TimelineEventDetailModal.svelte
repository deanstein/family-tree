<script>
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
	import {
		getModalTitleByEventType,
		writeUIStateValueAtPath
	} from '../../../../logic/ui-management';
	import { getObjectByKeyValue, instantiateObject, getIsDateValid } from '../../../../logic/utils';
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
	import SideBySideContainer from '../../../SideBySideContainer.svelte';

	// get the event data
	let eventDate = $tempState?.timelineEditEvent?.eventDate;
	let eventType = $tempState?.timelineEditEvent?.eventType;
	let eventContent = $tempState?.timelineEditEvent?.eventContent;

	let isNewEvent = false; // if true, this event was not found in this person's events
	let isValidDate = false; // if true, the current date in the field is valid
	let isBirthOrDeathEvent = false; // if true, this is a birth or death event which are always present but not stored as timeline events
	let isInEditMode = false; // if true, all fields will be editable

	// modal title changes based on the event type
	let modalTitle = undefined;

	// all possible input values
	let eventDateInputValue = $tempState?.timelineEditEvent?.eventDate;
	let eventTypeInputValue = $tempState?.timelineEditEvent?.eventType;
	let eventContentInputValue = $tempState?.timelineEditEvent?.eventContent;
	let birthdateInputValue = $uiState?.activePerson?.birth?.date;
	let birthtimeInputValue = $uiState?.activePerson?.birth?.time;
	let birthplaceInputValue = $uiState?.activePerson?.birth?.place;
	let deathDateInputValue = $uiState?.activePerson?.death?.date;
	let deathPlaceInputValue = $uiState?.activePerson?.death?.place;
	let deathTimeInputValue = $uiState?.activePerson?.death?.time;
	let deathCauseInputValue = $uiState?.activePerson?.death?.cause;

	// saves available inputs to the UI state
	const saveAllInputs = () => {
		switch (eventType) {
			case timelineEventTypes.birth.type:
				writeUIStateValueAtPath('activePerson.birth.date', birthdateInputValue);
				writeUIStateValueAtPath('activePerson.birth.place', birthplaceInputValue);
				writeUIStateValueAtPath('activePerson.birth.time', birthtimeInputValue);
				break;
			case timelineEventTypes.death.type:
				writeUIStateValueAtPath('activePerson.death.date', deathDateInputValue);
				writeUIStateValueAtPath('activePerson.death.place', deathPlaceInputValue);
				writeUIStateValueAtPath('activePerson.death.time', deathTimeInputValue);
				writeUIStateValueAtPath('activePerson.death.cause', deathCauseInputValue);
				break;
			case timelineEventTypes.generic.type:
			default:
				const newEventFromInputs = instantiateObject(timelineEvent);
				newEventFromInputs.eventId = $tempState.timelineEditEvent.eventId;
				newEventFromInputs.eventDate = eventDateInputValue;
				newEventFromInputs.eventType = eventTypeInputValue;
				newEventFromInputs.eventContent = eventContentInputValue;
				addOrReplaceTimelineEvent(newEventFromInputs);
		}
	};

	// synchronizes available inputs back to UI state values
	const syncAllInputs = () => {
		switch (eventType) {
			case timelineEventTypes.birth.type:
				birthdateInputValue = $uiState.activePerson.birth.date;
				birthtimeInputValue = $uiState.activePerson.birth.time;
				birthplaceInputValue = $uiState.activePerson.birth.place;
				break;
			case timelineEventTypes.death.type:
				deathDateInputValue = $uiState.activePerson.death.date;
				deathPlaceInputValue = $uiState.activePerson.death.place;
				deathTimeInputValue = $uiState.activePerson.death.time;
				deathCauseInputValue = $uiState.activePerson.death.cause;
				break;
			default:
				eventDateInputValue = $tempState.timelineEditEvent.eventDate;
				eventTypeInputValue = $tempState.timelineEditEvent.eventType;
				eventContentInputValue = $tempState.timelineEditEvent.eventContent;
		}
	};

	const onClickEditButton = () => {
		setTimelineEditEventId($tempState.timelineEditEvent.eventId);
	};

	// cancel, but when used for editing an existing event
	// resets the inputs to match the store
	const onClickCancelEditButton = () => {
		syncAllInputs();
		unsetTimelineEditEventId();
	};

	// cancel, but when used for creating a new event
	const onClickCancelNewEventButton = () => {
		unsetTimelineEditEventId();
		unsetTimelineEditEvent();
	};

	const onClickDoneButton = () => {
		saveAllInputs();
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

	// checks whether the value in the date input field is valid
	// critical to enable or disable the Done button depending on whether the date is good
	const getIsDateInputValid = (event) => {
		eventDateInputValue = event.target.value;
		isValidDate = getIsDateValid(eventDateInputValue);
	};

	const timelineEventOptions = {
		label: 'Event types:',
		timelineEventTypes
	};

	$: {
		isValidDate = getIsDateValid(eventDateInputValue);
		modalTitle = getModalTitleByEventType(eventType);
		isInEditMode = $tempState.timelineEditEventId !== undefined;
		isBirthOrDeathEvent =
			eventType === timelineEventTypes.birth.type || eventType === timelineEventTypes.death.type;
		isNewEvent = !getObjectByKeyValue(
			$uiState.activePerson.timelineEvents,
			'eventId',
			$tempState.timelineEditEventId
		)
			? true
			: false;
	}
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
		{#if eventType === timelineEventTypes.birth.type}
			<SideBySideContainer>
				<FieldContainer label={timelineEventStrings.birthdate}>
					<DatePicker
						bind:inputValue={birthdateInputValue}
						isEnabled={isInEditMode}
						onKeyUpFunction={getIsDateInputValid}
					/>
				</FieldContainer>
				<FieldContainer label={timelineEventStrings.birthtime}>
					<TextInput bind:inputValue={birthtimeInputValue} isEnabled={isInEditMode} />
				</FieldContainer>
			</SideBySideContainer>
			<FieldContainer label={timelineEventStrings.birthplace}>
				<TextInput bind:inputValue={birthplaceInputValue} isEnabled={isInEditMode} />
			</FieldContainer>

			<!-- death -->
		{:else if eventType === timelineEventTypes.death.type}
			<SideBySideContainer>
				<FieldContainer label={timelineEventStrings.deathDate}>
					<DatePicker bind:inputValue={deathDateInputValue} isEnabled={isInEditMode} />
				</FieldContainer>
				<FieldContainer label={timelineEventStrings.deathTime}>
					<TextInput bind:inputValue={deathTimeInputValue} isEnabled={isInEditMode} />
				</FieldContainer>
			</SideBySideContainer>
			<FieldContainer label={timelineEventStrings.deathPlace}>
				<TextInput bind:inputValue={deathPlaceInputValue} isEnabled={isInEditMode} />
			</FieldContainer>
			<FieldContainer label={timelineEventStrings.deathCause}>
				<TextInput bind:inputValue={deathCauseInputValue} isEnabled={isInEditMode} />
			</FieldContainer>

			<!-- standard content box if no event type or generic type -->
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
	</div>
	<div slot="modal-toolbar-slot">
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
					isEnabled={isValidDate}
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
