<script>
	import { get } from 'svelte/store';
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';
	import { v4 as uuidv4 } from 'uuid';

	import timelineEventTypes from '$lib/schemas/timeline-event-types';
	import timelineEventImage from '$lib/schemas/timeline-event-image';

	import { activePerson, hasUnsavedChanges } from '$lib/states/family-tree-state';
	import {
		imageEditContent,
		isNewImage,
		isNodeEditActive,
		isTimelineEventInEditMode,
		timelineEditEvent
	} from '$lib/states/temp-state';
	import {
		customDeleteMessage,
		postDeleteFunction,
		showDeleteModal,
		showTimelineEventDetailsModal,
		showTimelineEventImageDetailModal
	} from '$lib/states/ui-state';

	import {
		addOrReplaceTimelineEvent,
		deleteTimelineEvent,
		getTimelineEventById
	} from '$lib/person-management';
	import { getModalTitleByEventType } from '$lib/ui-management';
	import {
		getObjectByKeyValueInArray,
		instantiateObject,
		getIsDateValid,
		areObjectsEqual,
		requireAdminMode
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
	let isBirthOrDeathEvent = false; // if true, this is a birth or death event which are always

	// modal title changes based on the event type
	let modalTitle = undefined;

	// all possible input values
	let eventDateInputValue;
	let eventDateApprxValue;
	let eventTypeInputValue;
	let eventDescriptionInputValue;
	let birthdateInputValue;
	let birthdateApprxInputValue;
	let birthtimeInputValue;
	let birthplaceInputValue;
	let deathDateInputValue;
	let deathDateApprxInputValue;
	let deathPlaceInputValue;
	let deathTimeInputValue;
	let deathCauseInputValue;

	// dynamic styles
	let mediaContentContainerCss;

	// used for checking against latest event and setting unsaved changes flag to true
	let originalEventContent;

	onMount(() => {
		originalEventContent = get(timelineEditEvent);
		syncAllInputs();
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
				newEventFromInputs.eventContent.description = eventDescriptionInputValue;
				addOrReplaceTimelineEvent(newEventFromInputs);
		}
	};

	// synchronizes available inputs back to UI state values
	const syncAllInputs = () => {
		switch (eventType) {
			case timelineEventTypes.birth.type:
				birthdateInputValue = get(activePerson)?.birth?.date;
				birthdateApprxInputValue = get(activePerson)?.birth?.apprxDate;
				birthtimeInputValue = get(activePerson)?.birth?.time;
				birthplaceInputValue = get(activePerson)?.birth?.place;
				break;
			case timelineEventTypes.death.type:
				deathDateInputValue = get(activePerson)?.death?.date;
				deathDateApprxInputValue = get(activePerson)?.death?.apprxDate;
				deathPlaceInputValue = get(activePerson)?.death?.place;
				deathTimeInputValue = get(activePerson)?.death?.time;
				deathCauseInputValue = get(activePerson)?.death?.cause;
				break;
			default:
				eventDateInputValue = get(timelineEditEvent)?.eventDate;
				eventDateApprxValue = get(timelineEditEvent)?.isApprxDate;
				eventTypeInputValue = get(timelineEditEvent)?.eventType;
				eventDescriptionInputValue = get(timelineEditEvent)?.eventContent.description;
		}
	};

	const onClickEditButton = () => {
		isTimelineEventInEditMode.set(true);
	};

	// cancel, but when used for editing an existing event
	// resets the inputs to match the store
	const onClickCancelEditButton = () => {
		syncAllInputs();
		isTimelineEventInEditMode.set(false);
		isNodeEditActive.set(false);
	};
	// cancel, but when used for creating a new event
	const onClickCancelNewEventButton = () => {
		showTimelineEventDetailsModal.set(false);
		isTimelineEventInEditMode.set(false);
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
		isTimelineEventInEditMode.set(false);
		isNodeEditActive.set(false);
	};

	const onClickDeleteButton = () => {
		// if there are images, need to show the confirmation dialog
		if (get(timelineEditEvent).eventContent?.images?.length > 0) {
			// show the modal with a custom message
			showDeleteModal.set(true);
			customDeleteMessage.set(
				'This event contains images which require deletion on the server.\n\nDeleting this event will save all changes and cannot be undone.'
			);
			// set the function to run after delete is confirmed
			postDeleteFunction.set(() => requireAdminMode(onPostClickDelete));
		}
		// otherwise, delete directly
		else {
			onPostClickDelete();
		}
	};

	// runs after the
	const onPostClickDelete = () => {
		deleteTimelineEvent(get(timelineEditEvent));
		isTimelineEventInEditMode.set(false);
		timelineEditEvent.set(undefined);
		hasUnsavedChanges.set(true);
		showTimelineEventDetailsModal.set(false);
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
		isNewImage.set(true);
		showTimelineEventImageDetailModal.set(true);
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
			get(activePerson)?.timelineEvents,
			'eventId',
			get(timelineEditEvent)?.eventId
		)
			? true
			: false;

		mediaContentContainerCss = css`
			border: 2px solid
				${$isTimelineEventInEditMode ? stylingConstants.colors.activeColor : 'transparent'};
			border-radius: ${$isTimelineEventInEditMode
				? '0px'
				: stylingConstants.sizes.bioFieldBorderRadius};
		`;
	}
</script>

<Modal
	showModal={$showTimelineEventDetailsModal}
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
						isEnabled={$isTimelineEventInEditMode}
						onInputFunction={getIsDateInputValid}
					/>
				</InputContainer>
				<InputContainer label={timelineEventStrings.birthtime}>
					<TextInput bind:inputValue={birthtimeInputValue} isEnabled={$isTimelineEventInEditMode} />
				</InputContainer>
			</SideBySideContainer>
			<div class="approximate-date-row">
				<Checkbox
					label={timelineEventStrings.eventDateApprx}
					isEnabled={$isTimelineEventInEditMode}
					bind:isChecked={birthdateApprxInputValue}
				/>
			</div>
			<InputContainer label={timelineEventStrings.birthplace}>
				<TextInput bind:inputValue={birthplaceInputValue} isEnabled={$isTimelineEventInEditMode} />
			</InputContainer>

			<!-- death -->
		{:else if eventType === timelineEventTypes.death.type}
			<SideBySideContainer>
				<InputContainer label={timelineEventStrings.deathDate}>
					<DatePicker
						bind:inputValue={deathDateInputValue}
						isEnabled={$isTimelineEventInEditMode}
					/>
				</InputContainer>
				<InputContainer label={timelineEventStrings.deathTime}>
					<TextInput bind:inputValue={deathTimeInputValue} isEnabled={$isTimelineEventInEditMode} />
				</InputContainer>
			</SideBySideContainer>
			<div class="approximate-date-row">
				<Checkbox
					label={timelineEventStrings.eventDateApprx}
					isEnabled={$isTimelineEventInEditMode}
					bind:isChecked={deathDateApprxInputValue}
				/>
			</div>
			<InputContainer label={timelineEventStrings.deathPlace}>
				<TextInput bind:inputValue={deathPlaceInputValue} isEnabled={$isTimelineEventInEditMode} />
			</InputContainer>
			<InputContainer label={timelineEventStrings.deathCause}>
				<TextInput bind:inputValue={deathCauseInputValue} isEnabled={$isTimelineEventInEditMode} />
			</InputContainer>
			<!-- standard content box if no event type or generic type -->
		{:else}
			<SideBySideContainer>
				<InputContainer label="Date">
					<DatePicker
						isEnabled={$isTimelineEventInEditMode}
						bind:inputValue={eventDateInputValue}
					/>
				</InputContainer>
				<InputContainer label="Type">
					<Select
						isEnabled={$isTimelineEventInEditMode}
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
					isEnabled={$isTimelineEventInEditMode}
					bind:isChecked={eventDateApprxValue}
				/>
			</div>
			<InputContainer label="Description">
				<TextArea
					isEnabled={$isTimelineEventInEditMode}
					bind:inputValue={eventDescriptionInputValue}
				/>
			</InputContainer>
			<InputContainer label="Images">
				<div class="media-content-container {mediaContentContainerCss}">
					<ImageThumbnailGroup
						allowEdit={$isTimelineEventInEditMode}
						imageArray={$timelineEditEvent?.eventContent?.images ?? []}
						showGroupTitle={false}
						showAddButton={$isTimelineEventInEditMode}
						onClickAddButton={onClickAddImageButton}
					/>
				</div>
			</InputContainer>
			<InputContainer label="With" grow={true}>
				<div class="media-content-container {mediaContentContainerCss}">
					<AssociatedPersonNodeGroup
						showGroupTitle={false}
						showAddButton={$isTimelineEventInEditMode}
						enabled={$isTimelineEventInEditMode}
						associatedPeopleIds={$timelineEditEvent?.eventContent?.associatedPeopleIds}
					/>
				</div>
			</InputContainer>
		{/if}
	</div>
	<div slot="modal-toolbar-slot">
		<ModalActionsBar>
			{#if !$isTimelineEventInEditMode}
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
