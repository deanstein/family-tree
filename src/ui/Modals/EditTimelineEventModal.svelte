<script>
	import { onMount } from 'svelte';

	import uiState from '../../stores/ui-state';
	import tempState from '../../stores/temp-state';

	import timelineEvents from '../../schemas/timeline-event-types';

	import stylingConstants from '../styling-constants';

	import Button from '../Button.svelte';
	import DatePicker from './PersonDetailModal/Bio/DatePicker.svelte';
	import FieldContainer from '../FieldContainer.svelte';
	import Select from '../Select.svelte';
	import TextArea from '../TextArea.svelte';
	import {
		checkPersonForUnsavedChanges,
		setTimelineEditEventId,
		unsetTimelineEditEvent,
		unsetTimelineEditEventId
	} from '../../logic/temp-management';
	import { addOrReplaceTimelineEvent, deleteTimelineEvent } from '../../logic/person-management';
	import { getObjectByKeyValue, instantiateObject } from '../../logic/utils';
	import timelineEvent from '../../schemas/timeline-event';
	import Modal from './Modal.svelte';
	import ModalActionsBar from './ModalActionsBar.svelte';

	let isEnabled = false;
	let isKnownEvent = false;
	let eventDateInputValue = undefined;
	let eventTypeInputValue = undefined;
	let eventContentInputValue = undefined;

	const focusNameInput = (element) => {
		element.focus();
	};

	const onEditButtonAction = () => {
		setTimelineEditEventId($tempState.timelineEditEvent.eventId);
	};

	// cancel, but when used for editing an existing event
	const onCancelEditButtonAction = () => {
		unsetTimelineEditEventId();
	};

	// cancel, but when used for creating a new event
	const onCancelNewEventButtonAction = () => {
		unsetTimelineEditEventId();
		unsetTimelineEditEvent();
	};

	const onDoneButtonAction = () => {
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

	const onDeleteButtonAction = () => {
		deleteTimelineEvent($tempState.timelineEditEvent);
		checkPersonForUnsavedChanges($uiState.activePerson.id);
		unsetTimelineEditEventId();
		unsetTimelineEditEvent();
	};

	const onCloseButtonAction = () => {
		unsetTimelineEditEventId();
		unsetTimelineEditEvent();
	};

	const timelineEventOptions = {
		label: 'Event types:',
		timelineEvents
	};

	$: {
		isEnabled = $tempState.timelineEditEventId !== undefined;
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
		<FieldContainer label="Event Date">
			<DatePicker {isEnabled} bind:inputValue={eventDateInputValue} />
		</FieldContainer>
		<FieldContainer label="Event Type">
			<Select
				{isEnabled}
				bind:inputValue={eventTypeInputValue}
				optionsGroupObject={timelineEventOptions}
				optionValueKey="id"
			/>
		</FieldContainer>
		<FieldContainer label="Event Content" grow={true}>
			<TextArea {isEnabled} bind:inputValue={eventContentInputValue} />
		</FieldContainer>
		<ModalActionsBar>
			{#if $tempState.timelineEditEventId === undefined}
				<Button
					buttonText={'Edit'}
					onClickFunction={onEditButtonAction}
					overrideBackgroundColor={stylingConstants.colors.buttonColorSecondary}
				/>
				<Button buttonText={'Close'} onClickFunction={onCloseButtonAction} />
			{:else}
				{#if isKnownEvent}
					<Button
						buttonText="Delete"
						onClickFunction={onDeleteButtonAction}
						overrideColor={stylingConstants.colors.buttonColorDelete}
						overrideBackgroundColor="transparent"
						overrideBackgroundColorHover="{stylingConstants.colors.buttonColorDelete};"
					/>
				{/if}
				<Button
					buttonText={'Cancel'}
					onClickFunction={isKnownEvent ? onCancelEditButtonAction : onCancelNewEventButtonAction}
					overrideBackgroundColor={stylingConstants.colors.buttonColorSecondary}
				/>
				<Button
					buttonText="Done"
					isEnabled={eventDateInputValue}
					onClickFunction={onDoneButtonAction}
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
