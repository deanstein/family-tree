<script>
	import { onMount } from 'svelte';
	import { get } from 'svelte/store';
	import { css } from '@emotion/css';

	import { activePerson, hasUnsavedChanges } from '$lib/states/family-tree-state';
	import { bioEditId } from '$lib/states/temp-state';

	import { gender } from '$lib/schemas/gender';

	import {
		writeTempAlternateNamesToFamilyTree,
		setTempStateAltNamesFromUIState
	} from '$lib/temp-management';
	import { areObjectsEqual, getNumberOfYearsBetweenEvents } from '$lib/utils';

	import { personDetailStrings, timelineEventStrings } from '$lib/components/strings';

	import AlternateNames from '$lib/components/Bio/AlternateNames.svelte';
	import BioPhoto from '$lib/components/BioPhoto.svelte';
	import Checkbox from '$lib/components/Checkbox.svelte';
	import DatePicker from '$lib/components/DatePicker.svelte';
	import EditBioToolbar from '$lib/components/Bio/EditBioToolbar.svelte';
	import InputContainer from '$lib/components/InputContainer.svelte';
	import NameAge from '$lib/components/Bio/NameAge.svelte';
	import Overlay from '$lib/components/Modals/Overlay.svelte';
	import Selector from '$lib/components/Select.svelte';
	import SideBySideContainer from '$lib/components/SideBySideContainer.svelte';
	import TextInput from '$lib/components/TextInput.svelte';
	import stylingConstants from '$lib/components/styling-constants';

	let personId = get(activePerson).id;
	let isBioEditActive = false;
	let age = 0;

	// used for comparison to set unsaved changes flag if changes were made
	let cachedPerson;

	// set the value of each input from the active person
	let nameInputValue = get(activePerson).name;
	let genderInputValue = get(activePerson).gender;
	let birthdateInputValue = get(activePerson).birth.date;
	let birthplaceInputValue = get(activePerson).birth.place;
	let birthtimeInputValue = get(activePerson).birth.time;
	let hometownInputValue = get(activePerson).hometown;
	let deceasedValue = get(activePerson).deceased;
	let deathDateInputValue = get(activePerson).death.date;
	let deathTimeInputValue = get(activePerson).death.time;
	let deathPlaceInputValue = get(activePerson).death.place;
	let deathCauseInputValue = get(activePerson).death.cause;

	// set up the gender options for the select element
	const genderOptions = {
		label: 'Gender:',
		gender
	};

	onMount(() => {
		cachedPerson = get(activePerson);
	});

	// writes all inputs to the UI state
	const saveAllInputs = () => {
		activePerson.update((currentValue) => ({
			...currentValue,
			name: nameInputValue,
			gender: genderInputValue,
			birth: {
				...currentValue.birth,
				place: birthplaceInputValue,
				date: birthdateInputValue,
				time: birthtimeInputValue
			},
			hometown: hometownInputValue,
			deceased: deceasedValue,
			death: {
				...currentValue.death,
				date: deathDateInputValue,
				time: deathTimeInputValue,
				place: deathPlaceInputValue,
				cause: deathCauseInputValue
			}
		}));
		writeTempAlternateNamesToFamilyTree();
	};

	// synchronizes all inputs back to UI state values
	const syncAllInputs = () => {
		nameInputValue = get(activePerson).name;
		setTempStateAltNamesFromUIState();
		genderInputValue = get(activePerson).gender;
		birthdateInputValue = get(activePerson).birth.date;
		birthplaceInputValue = get(activePerson).birth.place;
		birthtimeInputValue = get(activePerson).birth.time;
		hometownInputValue = get(activePerson).hometown;
		deceasedValue = get(activePerson).deceased;
		deathDateInputValue = get(activePerson).death.date;
		deathTimeInputValue = get(activePerson).death.time;
		deathPlaceInputValue = get(activePerson).death.place;
		deathCauseInputValue = get(activePerson).death.cause;
	};

	const onClickBioEditButton = () => {
		setTempStateAltNamesFromUIState();
		bioEditId.set(personId);
		// set the cached person before the edit
		cachedPerson = get(activePerson);
	};

	const onClickDoneButton = () => {
		saveAllInputs();
		bioEditId.set(undefined);
		// set the unsaved changes flag if the person has been modified
		if (!areObjectsEqual(cachedPerson, get(activePerson))) {
			hasUnsavedChanges.set(true);
		}
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
			$activePerson.birth.date,
			$activePerson.deceased ? $activePerson.death.date : new Date()
		);

		// ensure that if the bio was edited from some other source,
		// the latest is always shown by setting all inputs to UI State
		syncAllInputs();
	}

	const bioContentContainerCss = css`
		z-index: ${stylingConstants.zIndices.personDetailViewZIndex};
	`;
</script>

{#if isBioEditActive}
	<Overlay />
{/if}
{#key $activePerson}
	<div class="bio-content-container {bioContentContainerCss}">
		<div class="bio-edit-toolbar">
			<EditBioToolbar
				{isBioEditActive}
				onBioEditButtonClick={onClickBioEditButton}
				onDoneButtonClick={onClickDoneButton}
				onCancelButtonClick={onClickCancelButton}
			/>
		</div>
		<div class="bio-avatar-container">
			<BioPhoto personId={$activePerson.id} allowEdit={isBioEditActive} />
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
{/key}

<style>
	.bio-content-container {
		position: relative;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		align-items: center;
		background-color: gainsboro;
		padding: 0 1vh 1vh 1vh;
		border-radius: 10px;
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
