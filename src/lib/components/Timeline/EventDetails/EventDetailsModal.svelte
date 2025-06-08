<script>
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';
	import { v4 as uuidv4 } from 'uuid';

	import timelineEventTypes from '$lib/schemas/timeline-event-types';
	import timelineEventImage from '$lib/schemas/timeline-event-image';

	import { activePerson, hasUnsavedChanges } from '$lib/states/family-tree-state';
	import { imageEditContent, isNodeEditActive, timelineEditEvent } from '$lib/states/temp-state';
	import { showTimelineEventDetailsModal } from '$lib/states/ui-state';

	import { addOrReplaceTimelineEvent, getTimelineEventById } from '$lib/person-management';
	import { getModalTitleByEventType } from '$lib/ui-management';
	import {
		getObjectByKeyValueInArray,
		instantiateObject,
		getIsDateValid,
		areObjectsEqual
	} from '$lib/utils';

	import { timelineEventStrings } from '$lib/components/strings';
	import stylingConstants from '$lib/components/styling-constants';

	import AssociatedPersonNodeGroup from '$lib/components/Timeline/EventDetails/AssociatedPersonNodeGroup.svelte';
	import Button from '$lib/components/Button.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import ImageThumbnailGroup from '$lib/components/ImageThumbnailGroup.svelte';
	import InputContainer from '$lib/components/InputContainer.svelte';
	import Modal from '$lib/components/Modals/Modal.svelte';
	import ModalActionsBar from '$lib/components/Modals/ModalActionsBar.svelte';
	import Select from '$lib/components/Select.svelte';
	import SideBySideContainer from '$lib/components/SideBySideContainer.svelte';
	import TextArea from '$lib/components/TextArea.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';

	// get the event data
	let eventType = get(timelineEditEvent).eventType;

	let isNewEvent = false; // if true, this event was not found in this person's events
	let isValidDate = false; // if true, the current date in the field is valid
	let isBirthOrDeathEvent = false; // if true, this is a birth or death event which are always present but not stored as timeline events
	let isInEditMode = false; // if true, all fields will be editable

	// modal title changes based on the event type
	let modalTitle = undefined;

	// all possible input values
	let eventDateInputValue = get(timelineEditEvent)?.eventDate;
	let eventDateApprxValue = get(timelineEditEvent)?.isApprxDate;
	let eventTypeInputValue = get(timelineEditEvent)?.eventType;
	let eventContentInputValue = get(timelineEditEvent)?.eventContent.description;
	let birthdateInputValue = get(activePerson).birth?.date;
	let birthdateApprxInputValue = get(activePerson).birth?.apprxDate;
	let birthtimeInputValue = get(activePerson).birth?.time;
	let birthplaceInputValue = get(activePerson).birth?.place;
	let deathDateInputValue = get(activePerson).death?.date;
	let deathDateApprxInputValue = get(activePerson).death?.apprxDate;
	let deathPlaceInputValue = get(activePerson).death?.place;
	let deathTimeInputValue = get(activePerson).death?.time;
	let deathCauseInputValue = get(activePerson).death?.cause;

	// dynamic styles
	let mediaContentContainerCss;

	// used for checking against latest event and setting unsaved changes flag to true
	let originalEventContent;

	onMount(() => {
		originalEventContent = get(timelineEditEvent);
	});

	// saves available inputs to the UI state
	const saveAllInputs = () => {
		switch (eventType) {
			// write the inputs for the active person's birth event
			case timelineEventTypes.birth.type:
				activePerson.update((currentValue) => {
					return {
						...currentValue,
						birth: {
							...currentValue.birth,
							date: birthdateInputValue,
							apprxDate: birthdateApprxInputValue,
							place: birthplaceInputValue,
							time: birthtimeInputValue
						}
					};
				});
			// write the inputs for the active person's death event
			case timelineEventTypes.death.type:
				activePerson.update((currentValue) => {
					return {
						...currentValue,
						death: {
							...currentValue.death,
							date: deathDateInputValue,
							apprxDate: deathDateApprxInputValue,
							place: deathPlaceInputValue,
							time: deathTimeInputValue,
							cause: deathCauseInputValue
						}
					};
				});
			case timelineEventTypes.generic.type:
			default:
				const newEventFromInputs = instantiateObject(get(timelineEditEvent));
				newEventFromInputs.eventId = get(timelineEditEvent).eventId;
				newEventFromInputs.eventDate = eventDateInputValue;
				newEventFromInputs.isApprxDate = eventDateApprxValue;
				newEventFromInputs.eventType = eventTypeInputValue;
				newEventFromInputs.eventContent.description = eventContentInputValue;
				addOrReplaceTimelineEvent(newEventFromInputs);
		}
	};

	// synchronizes available inputs back to UI state values
	const syncAllInputs = () => {
		switch (eventType) {
			case timelineEventTypes.birth.type:
				birthdateInputValue = get(activePerson).birth.date;
				birthdateApprxInputValue = get(activePerson).birth.apprxDate;
				birthtimeInputValue = get(activePerson).birth.time;
				birthplaceInputValue = get(activePerson).birth.place;
				break;
			case timelineEventTypes.death.type:
				deathDateInputValue = get(activePerson).death.date;
				deathDateApprxInputValue = get(activePerson).death.apprxDate;
				deathPlaceInputValue = get(activePerson).death.place;
				deathTimeInputValue = get(activePerson).death.time;
				deathCauseInputValue = get(activePerson).death.cause;
				break;
			default:
				eventDateInputValue = get(timelineEditEvent).eventDate;
				eventDateApprxValue = get(timelineEditEvent).isApprxDate;
				eventTypeInputValue = get(timelineEditEvent).eventType;
				eventContentInputValue = get(timelineEditEvent).eventContent.description;
		}
	};

	const onClickEditButton = () => {
		isInEditMode = true;
	};

	// cancel, but when used for editing an existing event
	// resets the inputs to match the store
	const onClickCancelEditButton = () => {
		syncAllInputs();
		isInEditMode = false;
		isNodeEditActive.set(false);
	};
	// cancel, but when used for creating a new event
	const onClickCancelNewEventButton = () => {
		isInEditMode = false;
		timelineEditEvent.set(undefined);
		isNodeEditActive.set(false);
	};

	const onClickDoneButton = () => {
		saveAllInputs();
		if (
			!areObjectsEqual(
				originalEventContent,
				getTimelineEventById(get(activePerson).id, get(timelineEditEvent).eventId)
			)
		) {
			hasUnsavedChanges.set(true);
		}
		isInEditMode = false;
		isNodeEditActive.set(false);
	};

	const onClickDeleteButton = () => {
		isInEditMode = false;
		timelineEditEvent.set(undefined);
		hasUnsavedChanges.set(true);
	};

	const onClickCloseButton = () => {
		showTimelineEventDetailsModal.set(false);
		timelineEditEvent.set(undefined);
		isNodeEditActive.set(false);
	};

	const onClickAddImageButton = () => {
		const newTimelineEventImage = instantiateObject(timelineEventImage);
		newTimelineEventImage.id = uuidv4();
		newTimelineEventImage.eventId = get(timelineEditEvent).eventId;
		imageEditContent.set(newTimelineEventImage);
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
		isBirthOrDeathEvent =
			eventType === timelineEventTypes.birth.type || eventType === timelineEventTypes.death.type;
		isNewEvent = !getObjectByKeyValueInArray(
			get(activePerson).timelineEvents,
			'eventId',
			get(timelineEditEvent).eventId
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
	showModal={$timelineEditEvent}
	title={modalTitle}
	height={stylingConstants.sizes.modalFormHeight}
	width={stylingConstants.sizes.modalFormWidth}
	subtitle={null}
	transparency={stylingConstants.colors.formBackgroundLegibleTransparency}
	zIndex={stylingConstants.zIndices.addEditAltNameZIndex}
>
	<div class="edit-timeline-event-modal-content" slot="modal-content-slot">
		<!-- modal content will depend on the event type -->

		<!-- birth -->
		{#if eventType === timelineEventTypes.birth.type}
			<SideBySideContainer>
				<InputContainer label={timelineEventStrings.birthdate}>
					<DatePicker
						bind:inputValue={birthdateInputValue}
						isEnabled={isInEditMode}
						onInputFunction={getIsDateInputValid}
					/>
				</InputContainer>
				<InputContainer label={timelineEventStrings.birthtime}>
					<TextInput bind:inputValue={birthtimeInputValue} isEnabled={isInEditMode} />
				</InputContainer>
			</SideBySideContainer>
			<div class="approximate-date-row">
				<Checkbox
					label={timelineEventStrings.eventDateApprx}
					isEnabled={isInEditMode}
					bind:isChecked={birthdateApprxInputValue}
				/>
			</div>
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
			<div class="approximate-date-row">
				<Checkbox
					label={timelineEventStrings.eventDateApprx}
					isEnabled={isInEditMode}
					bind:isChecked={deathDateApprxInputValue}
				/>
			</div>
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
			<div class="approximate-date-row">
				<Checkbox
					label={timelineEventStrings.eventDateApprx}
					isEnabled={isInEditMode}
					bind:isChecked={eventDateApprxValue}
				/>
			</div>
			<InputContainer label="Description">
				<TextArea isEnabled={isInEditMode} bind:inputValue={eventContentInputValue} />
			</InputContainer>
			<InputContainer label="Images">
				<div class="media-content-container {mediaContentContainerCss}">
					<ImageThumbnailGroup
						allowEdit={isInEditMode}
						imageArray={$timelineEditEvent?.eventContent?.images}
						showGroupTitle={false}
						showAddButton={true}
						showEmptyState={false}
						onClickAddFunction={onClickAddImageButton}
					/>
				</div>
			</InputContainer>
			<InputContainer label="With" grow={true}>
				<div class="media-content-container {mediaContentContainerCss}">
					<AssociatedPersonNodeGroup
						showGroupTitle={false}
						showAddButton={true}
						showEmptyState={false}
						enabled={isInEditMode}
					/>
				</div>
			</InputContainer>
		{/if}
	</div>
	<div slot="modal-toolbar-slot">
		<ModalActionsBar>
			{#if !isInEditMode}
				<Button
					buttonText={'Edit'}
					onClickFunction={onClickEditButton}
					overrideBackgroundColor={stylingConstants.colors.buttonColorPrimary}
				/>
				<Button
					buttonText={'Close'}
					onClickFunction={onClickCloseButton}
					overrideBackgroundColor={stylingConstants.colors.buttonColorSecondary}
				/>
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

	.approximate-date-row {
		width: -webkit-fill-available;
		padding-bottom: 10px;
		margin-top: -10px;
	}
</style>
