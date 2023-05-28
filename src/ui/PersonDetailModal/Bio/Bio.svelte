<script>
	import { css } from '@emotion/css';
	import { personDetailStrings } from '../../strings';
	import { gender } from '../../../schemas/person';
	import stylingConstants from '../../styling-constants';
	import uiState from '../../../stores/ui-state';
	import tempState from '../../../stores/temp-state';

	import Avatar from '../../NodeView/PersonNode/Avatar.svelte';
	import AlternateNames from './AlternateNames.svelte';
	import Checkbox from '../../Checkbox.svelte';
	import DatePicker from './DatePicker.svelte';
	import EditBioButton from './EditBioButton.svelte';
	import FieldContainer from './FieldContainer.svelte';
	import Name from './Name.svelte';
	import Overlay from '../../NodeView/Overlay.svelte';
	import Selector from '../../Select.svelte';
	import TextInput from '../../TextInput.svelte';
	import { writeUIStateValueAtPath } from '../../../logic/ui-management';
	import {
		checkPersonForUnsavedChanges,
		writeTempAlternateNamesToUIState,
		unsetAltNames,
		unsetCachedPerson,
		setCachedPerson,
		unsetBioEditId,
		initializeAltNamesTempState,
		setBioEditId
	} from '../../../logic/temp-management';
	import { onMount } from 'svelte';
	import { getPersonById } from '../../../logic/person-management';

	let personId = $uiState.activePerson.id;
	let isBioEditActive = false;

	// set the value of each input from the active person
	let nameInputValue = $uiState.activePerson.name;
	let nameInputValueOriginal = undefined;
	let genderInputValue = $uiState.activePerson.gender;
	let genderInputValueOriginal = undefined;
	let birthdateInputValue = $uiState.activePerson.birth.date;
	let birthdateInputValueOriginal = undefined;
	let birthplaceInputValue = $uiState.activePerson.birth.place;
	let birthplaceInputValueOriginal = undefined;
	let birthtimeInputValue = $uiState.activePerson.birth.time;
	let birthtimeInputValueOriginal = undefined;
	let hometownInputValue = $uiState.activePerson.hometown;
	let hometownInputValueOriginal = undefined;
	let deceasedValue = $uiState.activePerson.deceased;
	let deceasedValueOriginal = undefined;
	let deathDateInputValue = $uiState.activePerson.death.date;
	let deathDateInputValueOriginal = undefined;
	let deathTimeInputValue = $uiState.activePerson.death.time;
	let deathTimeInputValueOriginal = undefined;
	let deathPlaceInputValue = $uiState.activePerson.death.place;
	let deathPlaceInputValueOriginal = undefined;
	let deathCauseInputValue = $uiState.activePerson.death.cause;
	let deathCauseInputValueOriginal = undefined;

	const onBioEditButtonClick = () => {
		captureAllOriginalInputValues();
		initializeAltNamesTempState();
		setBioEditId(personId);
	};

	const onDoneButtonClick = () => {
		setCachedPerson(getPersonById(personId));
		saveAllInputs();
		unsetBioEditId();
	};

	const onCancelButtonClick = () => {
		discardAllInputs();
		unsetBioEditId();
	};

	const captureAllOriginalInputValues = () => {
		nameInputValueOriginal = nameInputValue;
		genderInputValueOriginal = genderInputValue;
		birthdateInputValueOriginal = birthdateInputValue;
		birthplaceInputValueOriginal = birthplaceInputValue;
		birthtimeInputValueOriginal = birthtimeInputValue;
		hometownInputValueOriginal = hometownInputValue;
		deceasedValueOriginal = deceasedValue;
		deathDateInputValueOriginal = deathDateInputValue;
		deathPlaceInputValueOriginal = deathPlaceInputValue;
		deathTimeInputValueOriginal = deathTimeInputValue;
		deathCauseInputValueOriginal = deathCauseInputValue;
	};

	const saveAllInputs = () => {
		writeUIStateValueAtPath('activePerson.name', nameInputValue, nameInputValueOriginal);
		writeTempAlternateNamesToUIState();
		writeUIStateValueAtPath('activePerson.gender', genderInputValue, genderInputValueOriginal);
		writeUIStateValueAtPath(
			'activePerson.birth.place',
			birthplaceInputValue,
			birthplaceInputValueOriginal
		);
		writeUIStateValueAtPath(
			'activePerson.birth.date',
			birthdateInputValue,
			birthdateInputValueOriginal
		);
		writeUIStateValueAtPath(
			'activePerson.birth.time',
			birthtimeInputValue,
			birthtimeInputValueOriginal
		);
		writeUIStateValueAtPath(
			'activePerson.hometown',
			hometownInputValue,
			hometownInputValueOriginal
		);
		writeUIStateValueAtPath('activePerson.deceased', deceasedValue, deceasedValueOriginal);
		writeUIStateValueAtPath(
			'activePerson.death.date',
			deathDateInputValue,
			deathDateInputValueOriginal
		);
		writeUIStateValueAtPath(
			'activePerson.death.time',
			deathTimeInputValue,
			deathTimeInputValueOriginal
		);
		writeUIStateValueAtPath(
			'activePerson.death.place',
			deathPlaceInputValue,
			deathPlaceInputValueOriginal
		);
		writeUIStateValueAtPath(
			'activePerson.death.cause',
			deathCauseInputValue,
			deathCauseInputValueOriginal
		);
		checkPersonForUnsavedChanges(personId);
	};

	const discardAllInputs = () => {
		unsetCachedPerson();
		nameInputValue = nameInputValueOriginal;
		unsetAltNames();
		genderInputValue = genderInputValueOriginal;
		birthdateInputValue = birthdateInputValueOriginal;
		birthplaceInputValue = birthplaceInputValueOriginal;
		birthtimeInputValue = birthtimeInputValueOriginal;
		hometownInputValue = hometownInputValueOriginal;
		deceasedValue = deceasedValueOriginal;
		deathDateInputValue = deathDateInputValueOriginal;
		deathPlaceInputValue = deathPlaceInputValueOriginal;
		deathTimeInputValue = deathTimeInputValueOriginal;
		deathCauseInputValue = deathCauseInputValueOriginal;
	};

	const genderOptions = {
		label: 'Gender:',
		gender
	};

	$: {
		if ($tempState.bioEditPersonId === personId) {
			isBioEditActive = true;
		} else {
			isBioEditActive = false;
		}
	}

	onMount(() => {
		setCachedPerson(getPersonById(personId));
	});

	const bioContentContainerDynamicClass = css`
		z-index: ${stylingConstants.zIndices.personDetailViewZIndex};
	`;
</script>

{#if isBioEditActive}
	<Overlay />
{/if}
<div id="bio-content-container" class="{bioContentContainerDynamicClass} bio-content-container">
	<div id="bio-edit-toolbar" class="bio-edit-toolbar">
		<EditBioButton
			{isBioEditActive}
			{onBioEditButtonClick}
			{onDoneButtonClick}
			{onCancelButtonClick}
		/>
	</div>
	<div id="bio-avatar-container" class="bio-avatar-container">
		<Avatar />
	</div>
	<Name isEnabled={isBioEditActive} bind:inputValue={nameInputValue} />
	<div id="bio-facts" class="bio-facts">
		<FieldContainer label={personDetailStrings.altNames}>
			<AlternateNames isEnabled={isBioEditActive} />
		</FieldContainer>

		<FieldContainer label={personDetailStrings.gender}>
			<Selector
				bind:inputValue={genderInputValue}
				isEnabled={isBioEditActive}
				optionsGroupObject={genderOptions}
				optionValueKey="id"
			/>
		</FieldContainer>

		<div class="side-by-side-fact-container">
			<FieldContainer label={personDetailStrings.birthdate}>
				<DatePicker bind:inputValue={birthdateInputValue} isEnabled={isBioEditActive} />
			</FieldContainer>

			<FieldContainer label={personDetailStrings.birthtime}>
				<TextInput bind:inputValue={birthtimeInputValue} isEnabled={isBioEditActive} />
			</FieldContainer>
		</div>

		<FieldContainer label={personDetailStrings.birthplace}>
			<TextInput bind:inputValue={birthplaceInputValue} isEnabled={isBioEditActive} />
		</FieldContainer>

		<FieldContainer label={personDetailStrings.hometown}>
			<TextInput bind:inputValue={hometownInputValue} isEnabled={isBioEditActive} />
		</FieldContainer>

		<Checkbox
			label={personDetailStrings.deceased}
			bind:isChecked={deceasedValue}
			isEnabled={isBioEditActive}
		/>
		{#if deceasedValue}
			<div id="deceased-details-container" class="deceased-details-container">
				<div class="side-by-side-fact-container">
					<FieldContainer label={personDetailStrings.deathDate}>
						<DatePicker bind:inputValue={deathDateInputValue} isEnabled={isBioEditActive} />
					</FieldContainer>

					<FieldContainer label={personDetailStrings.deathTime}>
						<TextInput bind:inputValue={deathTimeInputValue} isEnabled={isBioEditActive} />
					</FieldContainer>
				</div>

				<FieldContainer label={personDetailStrings.deathPlace}>
					<TextInput bind:inputValue={deathPlaceInputValue} isEnabled={isBioEditActive} />
				</FieldContainer>

				<FieldContainer label={personDetailStrings.deathCause}>
					<TextInput bind:inputValue={deathCauseInputValue} isEnabled={isBioEditActive} />
				</FieldContainer>
			</div>
		{/if}
	</div>
</div>

<style>
	.bio-content-container {
		position: relative;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		align-items: center;
		background-color: gainsboro;
		padding: 0 1vh 1vh 1vh;
	}

	.bio-edit-toolbar {
		position: sticky;
		display: grid;
		justify-content: right;
		top: 0;
		width: 100%;
		gap: 1vw;
		padding-top: 1vh;
		margin-bottom: 2vh;
	}

	.bio-avatar-container {
		width: 20vh;
		height: 20vh;
	}

	.bio-facts {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		gap: 1vh;
	}

	.side-by-side-fact-container {
		display: flex;
		gap: 1vh;
	}

	.deceased-details-container {
		display: flex;
		flex-direction: column;
		gap: 1vh;
		padding-top: 0.25vw;
	}
</style>
