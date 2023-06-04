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
		setTimelineEditEvent,
		unsetTimelineEditEvent
	} from '../../../logic/temp-management';
	import { addOrReplaceTimelineEvent } from '../../../logic/person-management';
	import { instantiateObject } from '../../../logic/utils';
	import timelineEvent from '../../../schemas/timeline-event';

	let eventDateInputValue = undefined;
	let eventTypeInputValue = undefined;
	let eventContentInputValue = undefined;

	const focusNameInput = (element) => {
		element.focus();
	};

	const onDoneButtonAction = () => {
		const newEventFromInputs = instantiateObject(timelineEvent);
		newEventFromInputs.eventId = $tempState.timelineEditEvent.eventId;
		newEventFromInputs.eventDate = eventDateInputValue;
		newEventFromInputs.eventType = eventTypeInputValue;
		newEventFromInputs.eventContent = eventContentInputValue;
		addOrReplaceTimelineEvent(newEventFromInputs);
		checkPersonForUnsavedChanges($uiState.activePerson.id);
		unsetTimelineEditEvent();
	};

	const onCancelButtonAction = () => {
		setTimelineEditEvent();
	};

	const timelineEventOptions = {
		label: 'Event types:',
		timelineEvents
	};

	let addAlternateNameModalDynamicClass = css`
		z-index: ${stylingConstants.zIndices.addEditAltNameZIndex};
	`;

	onMount(() => {
		eventDateInputValue = $tempState.timelineEditEvent.eventDate;
		eventTypeInputValue = $tempState.timelineEditEvent.eventType;
		eventContentInputValue = $tempState.timelineEditEvent.eventContent;
	});
</script>

<div
	id="edit-alternate-name-modal-container"
	class="{addAlternateNameModalDynamicClass} edit-alternate-name-modal-container"
>
	<div id="edit-alternate-name-modal-content" class="edit-alternate-name-modal-content">
		<div id="edit-alternate-name-modal-title" class="edit-alternate-name-modal-title">
			{'Event details'}
		</div>
		<FieldContainer label="Event Date">
			<DatePicker bind:inputValue={eventDateInputValue} />
		</FieldContainer>
		<FieldContainer label="Event Type">
			<Select
				isEnabled={false}
				bind:inputValue={eventTypeInputValue}
				optionsGroupObject={timelineEventOptions}
				optionValueKey="id"
			/>
		</FieldContainer>
		<FieldContainer label="Event Content">
			<TextArea bind:inputValue={eventContentInputValue} />
		</FieldContainer>
		<div id="edit-alternate-name-button-container" class="edit-alternate-name-button-container">
			<Button
				buttonText={'Cancel'}
				onClickFunction={onCancelButtonAction}
				overrideBackgroundColor={stylingConstants.colors.buttonColorSecondary}
			/>
			<Button
				buttonText="Done"
				isEnabled={eventDateInputValue}
				onClickFunction={onDoneButtonAction}
			/>
		</div>
	</div>
	<Overlay zIndexOverride={-1} />
</div>

<style>
	.edit-alternate-name-modal-container {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100vw;
	}

	.edit-alternate-name-modal-content {
		display: flex;
		flex-direction: column;
		gap: 1vh;
		padding: 1vw;
		width: 10vw;
		background-color: lightGray;
	}

	.edit-alternate-name-modal-title {
		font-size: 2vh;
	}

	.edit-alternate-name-button-container {
		display: flex;
		justify-content: right;
		gap: 0.5vw;
	}
</style>
