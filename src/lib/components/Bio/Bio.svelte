<script>
	import { onMount } from 'svelte';
	import { css } from '@emotion/css';

	import { bioEditId } from '$lib/states/temp-state';
	import uiState from '$lib/stores/ui-state';

	import { gender } from '$lib/schemas/gender';

	import {
		checkPersonForUnsavedChanges,
		writeTempAlternateNamesToUIState,
		setCachedPerson,
		setTempStateAltNamesFromUIState
	} from '$lib/temp-management';
	import { writeUIStateValueAtPath } from '$lib/ui-management';
	import { getPersonById } from '$lib/person-management';
	import { getNumberOfYearsBetweenEvents } from '$lib/utils';

	import stylingConstants from '$lib/components/styling-constants';
	import { personDetailStrings, timelineEventStrings } from '$lib/components/strings';

	import AlternateNames from '$lib/components/Bio/AlternateNames.svelte';
	import BioPhoto from '$lib/components/BioPhoto.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import EditBioButton from '$lib/components/Bio/EditBioButton.svelte';
	import InputContainer from '$lib/components/InputContainer.svelte';
	import NameAge from '$lib/components/Bio/NameAge.svelte';
	import Overlay from '$lib/components/Modals/Overlay.svelte';
	import Selector from '$lib/components/Select.svelte';
	import SideBySideContainer from '$lib/components/SideBySideContainer.svelte';
	import TextInput from '$lib/components/TextInput.svelte';

	let personId = $uiState.activePerson.id;
	let isBioEditActive = false;

	let age = 0;

	// set the value of each input from the active person
	let nameInputValue = $uiState.activePerson.name;
	let genderInputValue = $uiState.activePerson.gender;
	let birthdateInputValue = $uiState.activePerson.birth.date;
	let birthplaceInputValue = $uiState.activePerson.birth.place;
	let birthtimeInputValue = $uiState.activePerson.birth.time;
	let hometownInputValue = $uiState.activePerson.hometown;
	let deceasedValue = $uiState.activePerson.deceased;
	let deathDateInputValue = $uiState.activePerson.death.date;
	let deathTimeInputValue = $uiState.activePerson.death.time;
	let deathPlaceInputValue = $uiState.activePerson.death.place;
	let deathCauseInputValue = $uiState.activePerson.death.cause;

	// set up the gender options for the select element
	const genderOptions = {
		label: 'Gender:',
		gender
	};

	// writes all inputs to the UI state
	const saveAllInputs = () => {
		writeUIStateValueAtPath('activePerson.name', nameInputValue);
		writeTempAlternateNamesToUIState();
		writeUIStateValueAtPath('activePerson.gender', genderInputValue);
		writeUIStateValueAtPath('activePerson.birth.place', birthplaceInputValue);
		writeUIStateValueAtPath('activePerson.birth.date', birthdateInputValue);
		writeUIStateValueAtPath('activePerson.birth.time', birthtimeInputValue);
		writeUIStateValueAtPath('activePerson.hometown', hometownInputValue);
		writeUIStateValueAtPath('activePerson.deceased', deceasedValue);
		writeUIStateValueAtPath('activePerson.death.date', deathDateInputValue);
		writeUIStateValueAtPath('activePerson.death.time', deathTimeInputValue);
		writeUIStateValueAtPath('activePerson.death.place', deathPlaceInputValue);
		writeUIStateValueAtPath('activePerson.death.cause', deathCauseInputValue);
	};

	// synchronizes all inputs back to UI state values
	const syncAllInputs = () => {
		nameInputValue = $uiState.activePerson.name;
		setTempStateAltNamesFromUIState();
		genderInputValue = $uiState.activePerson.gender;
		birthdateInputValue = $uiState.activePerson.birth.date;
		birthplaceInputValue = $uiState.activePerson.birth.place;
		birthtimeInputValue = $uiState.activePerson.birth.time;
		hometownInputValue = $uiState.activePerson.hometown;
		deceasedValue = $uiState.activePerson.deceased;
		deathDateInputValue = $uiState.activePerson.death.date;
		deathTimeInputValue = $uiState.activePerson.death.time;
		deathPlaceInputValue = $uiState.activePerson.death.place;
		deathCauseInputValue = $uiState.activePerson.death.cause;
	};

	const onClickBioEditButton = () => {
		setTempStateAltNamesFromUIState();
		bioEditId.set(personId);
	};

	const onClickDoneButton = () => {
		saveAllInputs();
		checkPersonForUnsavedChanges(personId);
		bioEditId.set(undefined);
	};

	const onClickCancelButton = () => {
		syncAllInputs();
		bioEditId.set(undefined);
	};

	$: {
		if ($bioEditId === personId) {
			isBioEditActive = true;
		} else {
			isBioEditActive = false;
		}

		age = getNumberOfYearsBetweenEvents(
			$uiState.activePerson.birth.date,
			$uiState.activePerson.deceased ? $uiState.activePerson.death.date : new Date()
		);

		// ensure that if the bio was edited from some other source,
		// the latest is always shown by setting all inputs to UI State
		syncAllInputs();
	}

	onMount(() => {
		setCachedPerson(getPersonById(personId));
	});

	const bioContentContainerCss = css`
		z-index: ${stylingConstants.zIndices.personDetailViewZIndex};
	`;
</script>

{#if isBioEditActive}
	<Overlay />
{/if}
<div class="bio-content-container {bioContentContainerCss}">
	<div class="bio-edit-toolbar">
		<EditBioButton
			{isBioEditActive}
			onBioEditButtonClick={onClickBioEditButton}
			onDoneButtonClick={onClickDoneButton}
			onCancelButtonClick={onClickCancelButton}
		/>
	</div>
	<div class="bio-avatar-container">
		<BioPhoto personId={$uiState.activePerson.id} allowEdit={isBioEditActive} />
	</div>
	<NameAge isEnabled={isBioEditActive} bind:inputValue={nameInputValue} {age} />
	<div class="bio-facts">
		<InputContainer label={personDetailStrings.altNames}>
			<AlternateNames isEnabled={isBioEditActive} />
		</InputContainer>

		<InputContainer label={personDetailStrings.gender}>
			<Selector
				bind:inputValue={genderInputValue}
				isEnabled={isBioEditActive}
				optionsGroupObject={genderOptions}
				optionValueKey="id"
			/>
		</InputContainer>

		<SideBySideContainer>
			<InputContainer label={timelineEventStrings.birthdate}>
				<DatePicker bind:inputValue={birthdateInputValue} isEnabled={isBioEditActive} />
			</InputContainer>

			<InputContainer label={timelineEventStrings.birthtime}>
				<TextInput bind:inputValue={birthtimeInputValue} isEnabled={isBioEditActive} />
			</InputContainer>
		</SideBySideContainer>

		<InputContainer label={timelineEventStrings.birthplace}>
			<TextInput bind:inputValue={birthplaceInputValue} isEnabled={isBioEditActive} />
		</InputContainer>

		<InputContainer label={personDetailStrings.hometown}>
			<TextInput bind:inputValue={hometownInputValue} isEnabled={isBioEditActive} />
		</InputContainer>

		<Checkbox
			label={timelineEventStrings.deceased}
			bind:isChecked={deceasedValue}
			isEnabled={isBioEditActive}
		/>
		{#if deceasedValue}
			<div class="deceased-details-container">
				<SideBySideContainer>
					<InputContainer label={timelineEventStrings.deathDate}>
						<DatePicker bind:inputValue={deathDateInputValue} isEnabled={isBioEditActive} />
					</InputContainer>

					<InputContainer label={timelineEventStrings.deathTime}>
						<TextInput bind:inputValue={deathTimeInputValue} isEnabled={isBioEditActive} />
					</InputContainer>
				</SideBySideContainer>

				<InputContainer label={timelineEventStrings.deathPlace}>
					<TextInput bind:inputValue={deathPlaceInputValue} isEnabled={isBioEditActive} />
				</InputContainer>

				<InputContainer label={timelineEventStrings.deathCause}>
					<TextInput bind:inputValue={deathCauseInputValue} isEnabled={isBioEditActive} />
				</InputContainer>
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
		position: relative;
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

	.deceased-details-container {
		display: flex;
		flex-direction: column;
		gap: 1vh;
		padding-top: 0.25vw;
	}
</style>
