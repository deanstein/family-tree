<script>
	import { css } from '@emotion/css';
	import { v4 as uuidv4 } from 'uuid';

	import uiState from '../../../stores/ui-state';
	import tempState from '../../../stores/temp-state';

	import timelineEventTypes from '../../../schemas/timeline-event-types';
	import timelineEventImage from '../../../schemas/timeline-event-image';

	import {
		checkActivePersonForUnsavedChanges,
		setImageEditContent,
		setImageEditId,
		setTimelineEditEventId,
		unsetTimelineEditEvent,
		unsetTimelineEditEventId
	} from '../../../lib/temp-management';
	import { addOrReplaceTimelineEvent, deleteTimelineEvent } from '../../../lib/person-management';
	import { getModalTitleByEventType, writeUIStateValueAtPath } from '../../../lib/ui-management';
	import {
		getObjectByKeyValueInArray,
		instantiateObject,
		getIsDateValid
	} from '../../../lib/utils';
	import { timelineEventStrings } from '../../strings';

	import stylingConstants from '../../styling-constants';

	import AssociatedPersonNodeGroup from './AssociatedPersonNodeGroup.svelte';
	import Button from '../../Button.svelte';
	import DatePicker from '../../DatePicker.svelte';
	import ImageThumbnailGroup from '../../ImageThumbnailGroup.svelte';
	import InputContainer from '../../InputContainer.svelte';
	import Modal from '../../Modals/Modal.svelte';
	import ModalActionsBar from '../../Modals/ModalActionsBar.svelte';
	import Select from '../../Select.svelte';
	import SideBySideContainer from '../../SideBySideContainer.svelte';
	import TextArea from '../../TextArea.svelte';
	import TextInput from '../../TextInput.svelte';

	// get the event data
	let eventType = $tempState?.timelineEditEvent?.eventType;

	let isNewEvent = false; // if true, this event was not found in this person's events
	let isValidDate = false; // if true, the current date in the field is valid
	let isBirthOrDeathEvent = false; // if true, this is a birth or death event which are always present but not stored as timeline events
	let isInEditMode = false; // if true, all fields will be editable

	// modal title changes based on the event type
	let modalTitle = undefined;

	// all possible input values
	let eventDateInputValue = $tempState?.timelineEditEvent?.eventDate;
	let eventTypeInputValue = $tempState?.timelineEditEvent?.eventType;
	let eventContentInputValue = $tempState?.timelineEditEvent?.eventContent.description;
	let birthdateInputValue = $uiState?.activePerson?.birth?.date;
	let birthtimeInputValue = $uiState?.activePerson?.birth?.time;
	let birthplaceInputValue = $uiState?.activePerson?.birth?.place;
	let deathDateInputValue = $uiState?.activePerson?.death?.date;
	let deathPlaceInputValue = $uiState?.activePerson?.death?.place;
	let deathTimeInputValue = $uiState?.activePerson?.death?.time;
	let deathCauseInputValue = $uiState?.activePerson?.death?.cause;

	// dynamic styles
	let mediaContentContainerCss;

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
				const newEventFromInputs = instantiateObject($tempState.timelineEditEvent);
				newEventFromInputs.eventId = $tempState.timelineEditEvent.eventId;
				newEventFromInputs.eventDate = eventDateInputValue;
				newEventFromInputs.eventType = eventTypeInputValue;
				newEventFromInputs.eventContent.description = eventContentInputValue;
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
				eventContentInputValue = $tempState.timelineEditEvent.eventContent.description;
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
		checkActivePersonForUnsavedChanges();
		unsetTimelineEditEventId();
		unsetTimelineEditEvent();
	};

	const onClickDeleteButton = () => {
		deleteTimelineEvent($tempState.timelineEditEvent);
		checkActivePersonForUnsavedChanges();
		unsetTimelineEditEventId();
		unsetTimelineEditEvent();
	};

	const onClickCloseButton = () => {
		unsetTimelineEditEventId();
		unsetTimelineEditEvent();
	};

	const onClickAddImageButton = () => {
		const newTimelineEventImage = instantiateObject(timelineEventImage);
		newTimelineEventImage.id = uuidv4();
		setImageEditId(newTimelineEventImage.id);
		setImageEditContent(newTimelineEventImage);
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
		isNewEvent = !getObjectByKeyValueInArray(
			$uiState.activePerson.timelineEvents,
			'eventId',
			$tempState.timelineEditEventId
		)
			? true
			: false;

		mediaContentContainerCss = css`
			border: 2px solid ${isInEditMode ? stylingConstants.colors.activeColor : 'transparent'};
			border-radius: ${isInEditMode ? '0px' : stylingConstants.sizes.bioFieldBorderRadius};
		`;
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
				<InputContainer label={timelineEventStrings.birthdate}>
					<DatePicker
						bind:inputValue={birthdateInputValue}
						isEnabled={isInEditMode}
						onKeyUpFunction={getIsDateInputValid}
					/>
				</InputContainer>
				<InputContainer label={timelineEventStrings.birthtime}>
					<TextInput bind:inputValue={birthtimeInputValue} isEnabled={isInEditMode} />
				</InputContainer>
			</SideBySideContainer>
			<InputContainer label={timelineEventStrings.birthplace}>
				<TextInput bind:inputValue={birthplaceInputValue} isEnabled={isInEditMode} />
			</InputContainer>

			<!-- death -->
		{:else if eventType === timelineEventTypes.death.type}
			<SideBySideContainer>
				<InputContainer label={timelineEventStrings.deathDate}>
					<DatePicker bind:inputValue={deathDateInputValue} isEnabled={isInEditMode} />
				</InputContainer>
				<InputContainer label={timelineEventStrings.deathTime}>
					<TextInput bind:inputValue={deathTimeInputValue} isEnabled={isInEditMode} />
				</InputContainer>
			</SideBySideContainer>
			<InputContainer label={timelineEventStrings.deathPlace}>
				<TextInput bind:inputValue={deathPlaceInputValue} isEnabled={isInEditMode} />
			</InputContainer>
			<InputContainer label={timelineEventStrings.deathCause}>
				<TextInput bind:inputValue={deathCauseInputValue} isEnabled={isInEditMode} />
			</InputContainer>

			<!-- standard content box if no event type or generic type -->
		{:else}
			<SideBySideContainer>
				<InputContainer label="Date">
					<DatePicker isEnabled={isInEditMode} bind:inputValue={eventDateInputValue} />
				</InputContainer>
				<InputContainer label="Type">
					<Select
						isEnabled={isInEditMode}
						bind:inputValue={eventTypeInputValue}
						optionsGroupObject={timelineEventOptions}
						optionValueKey="type"
						optionLabelKey="label"
					/>
				</InputContainer>
			</SideBySideContainer>
			<InputContainer label="Description">
				<TextArea isEnabled={isInEditMode} bind:inputValue={eventContentInputValue} />
			</InputContainer>
			<InputContainer label="Images">
				<div class="{mediaContentContainerCss} media-content-container">
					<ImageThumbnailGroup
						images={$tempState?.timelineEditEvent?.eventContent?.images}
						showGroupTitle={false}
						showAddButton={isInEditMode}
						onClickAddButtonFunction={onClickAddImageButton}
					/>
				</div>
			</InputContainer>
			<InputContainer label="With" grow={true}>
				<div class="{mediaContentContainerCss} media-content-container">
					<AssociatedPersonNodeGroup showGroupTitle={false} showAddButton={isInEditMode} />
				</div>
			</InputContainer>
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

	.media-content-container {
		display: flex;
		flex-direction: column;
		padding: 10px;
		background-color: white;
	}
</style>
