<script>
	import { css } from '@emotion/css';
	import { onMount } from 'svelte';

	import uiState from '../../../stores/ui-state';
	import tempState from '../../../stores/temp-state';

	import timelineEvents from '../../../schemas/timeline-event-types';

	import stylingConstants from '../../styling-constants';

	import Button from '../../Button.svelte';
	import DatePicker from '../Bio/DatePicker.svelte';
	import FieldContainer from '../../FieldContainer.svelte';
	import Overlay from '../../NodeView/Overlay.svelte';
	import Select from '../../Select.svelte';
	import TextArea from '../../TextArea.svelte';
	import {
		checkPersonForUnsavedChanges,
		setTimelineEditEventId,
		unsetTimelineEditEvent,
		unsetTimelineEditEventId
	} from '../../../logic/temp-management';
	import { addOrReplaceTimelineEvent, deleteTimelineEvent } from '../../../logic/person-management';
	import {
		deleteObjectByKeyValue,
		getObjectByKeyValue,
		instantiateObject
	} from '../../../logic/utils';
	import timelineEvent from '../../../schemas/timeline-event';

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
		unsetTimelineEditEvent();
		unsetTimelineEditEventId();
	};

	const onCancelButtonAction = () => {
		unsetTimelineEditEventId();
		unsetTimelineEditEvent();
	};

	const timelineEventOptions = {
		label: 'Event types:',
		timelineEvents
	};

	let addAlternateNameModalDynamicClass = css`
		z-index: ${stylingConstants.zIndices.addEditAltNameZIndex};
	`;

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

<div
	id="edit-timeline-event-modal-container"
	class="{addAlternateNameModalDynamicClass} edit-timeline-event-modal-container"
>
	<div id="edit-timeline-event-modal-content" class="edit-timeline-event-modal-content">
		<div id="edit-timeline-event-modal-title" class="edit-timeline-event-modal-title">
			{'Event details'}
		</div>
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
		<FieldContainer label="Event Content">
			<TextArea {isEnabled} bind:inputValue={eventContentInputValue} />
		</FieldContainer>
		<div id="edit-timeline-event-button-container" class="edit-timeline-event-button-container">
			{#if $tempState.timelineEditEventId === undefined}
				<Button
					buttonText={'Edit'}
					onClickFunction={onEditButtonAction}
					overrideBackgroundColor={stylingConstants.colors.buttonColorSecondary}
				/>
				<Button buttonText={'Close'} onClickFunction={onCancelButtonAction} />
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
					onClickFunction={onCancelButtonAction}
					overrideBackgroundColor={stylingConstants.colors.buttonColorSecondary}
				/>
				<Button
					buttonText="Done"
					isEnabled={eventDateInputValue}
					onClickFunction={onDoneButtonAction}
					overrideBackgroundColor={stylingConstants.colors.buttonColorDone}
				/>
			{/if}
		</div>
	</div>
	<Overlay zIndexOverride={-1} />
</div>

<style>
	.edit-timeline-event-modal-container {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100%;
	}

	.edit-timeline-event-modal-content {
		display: flex;
		flex-direction: column;
		gap: 1vh;
		padding: 1vw;
		width: 10vw;
		background-color: lightGray;
	}

	.edit-timeline-event-modal-title {
		font-size: 2vh;
	}

	.edit-timeline-event-button-container {
		display: flex;
		justify-content: right;
		gap: 0.5vw;
	}
</style>
