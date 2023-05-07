<script>
	import { personDetailStrings } from '../../strings';
	import { gender } from '../../../schemas/person';
	import uiState from '../../../stores/ui-state';
	import tempState from '../../../stores/temp-state';

	import { setBioEditId, unsetBioEditId } from '../../../logic/temp-management';

	import Avatar from '../../NodeView/PersonNode/Avatar.svelte';
	import AltNames from './AltNames.svelte';
	import Checkbox from './Checkbox.svelte';
	import DatePicker from './DatePicker.svelte';
	import EditBioButton from './EditBioButton.svelte';
	import FieldContainer from './FieldContainer.svelte';
	import Selector from '../../Select.svelte';
	import TextInput from '../../TextInput.svelte';
	import { writeUIStateValueAtPath } from '../../../logic/ui-management';

	let personId = $uiState.activePerson.id;
	let isBioEditActive = false;

	// set the value of each input from the active person
	let alternateNamesInputValue = $uiState.activePerson.alternateNames;
	let alternateNamesInputValueOriginal = undefined;
	let genderInputValue = $uiState.activePerson.gender;
	let genderInputValueOriginal = undefined;
	let birthdateInputValue = $uiState.activePerson.birth.date;
	let birthdateInputValueOriginal = undefined;
	let birthplaceInputValue = $uiState.activePerson.birth.place;
	let birthplaceInputValueOriginal = undefined;
	let hometownInputValue = $uiState.activePerson.hometown;
	let hometownInputValueOriginal = undefined;

	const initializeAllInputs = () => {
		alternateNamesInputValueOriginal = alternateNamesInputValue;
		genderInputValueOriginal = genderInputValue;
		birthdateInputValueOriginal = birthdateInputValue;
		birthplaceInputValueOriginal = birthplaceInputValue;
		hometownInputValueOriginal = hometownInputValue;
	};

	const saveAllInputs = () => {
		writeUIStateValueAtPath('activePerson.alternateNames', alternateNamesInputValue);
		writeUIStateValueAtPath('activePerson.gender', genderInputValue);
		writeUIStateValueAtPath('activePerson.birth.place', birthplaceInputValue);
		writeUIStateValueAtPath('activePerson.birth.date', birthdateInputValue);
		writeUIStateValueAtPath('activePerson.hometown', hometownInputValue);
	};

	const discardAllInputs = () => {
		alternateNamesInputValue = alternateNamesInputValueOriginal;
		genderInputValue = genderInputValueOriginal;
		birthdateInputValue = birthdateInputValueOriginal;
		birthplaceInputValue = birthplaceInputValueOriginal;
		hometownInputValue = hometownInputValueOriginal;
	};

	const genderOptions = {
		label: 'Gender:',
		gender
	};

	const startBioEditingMode = () => {
		initializeAllInputs();
		setBioEditId(personId);
	};

	const endBioEditingModeAndSave = () => {
		saveAllInputs();
		unsetBioEditId();
	};

	const endBioEditingModeAndDiscard = () => {
		discardAllInputs();
		unsetBioEditId();
	};

	$: {
		if ($tempState.bioEditPersonId === personId) {
			isBioEditActive = true;
		} else {
			isBioEditActive = false;
		}
	}
</script>

<div id="bio-content-container" class="bio-content-container">
	<div id="bio-avatar-container" class="bio-avatar-container">
		<Avatar />
	</div>
	<div id="bio-name" class="bio-name">
		{$uiState.activePerson.name}
	</div>
	<div id="bio-facts" class="bio-facts">
		<EditBioButton
			{personId}
			{isBioEditActive}
			{startBioEditingMode}
			{endBioEditingModeAndSave}
			{endBioEditingModeAndDiscard}
		/>

		<FieldContainer label={personDetailStrings.altNames}>
			<AltNames />
		</FieldContainer>

		<FieldContainer label={personDetailStrings.gender}>
			<Selector optionsGroupObject={genderOptions} optionValueKey="id" />
		</FieldContainer>

		<FieldContainer label={personDetailStrings.birthdate}>
			<DatePicker />
		</FieldContainer>

		<FieldContainer label={personDetailStrings.birthplace}>
			<TextInput isEnabled={isBioEditActive} bind:inputValue={birthplaceInputValue} />
		</FieldContainer>

		<FieldContainer label={personDetailStrings.hometown}>
			<TextInput isEnabled={isBioEditActive} bind:inputValue={hometownInputValue} />
		</FieldContainer>

		<Checkbox label="Deceased?" isChecked={$uiState.activePerson.deceased} />
		{#if $uiState.activePerson.deceased}
			<div id="deceased-details-container" class="deceased-details-container">
				<FieldContainer label={personDetailStrings.deathdate}>
					<DatePicker />
				</FieldContainer>
				<FieldContainer label={personDetailStrings.deathplace}>
					<TextInput />
				</FieldContainer>
			</div>
		{/if}
	</div>
</div>

<style>
	.bio-content-container {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		justify-content: center;
		align-items: center;
		background-color: gainsboro;
		padding: 1vh;
	}

	.bio-avatar-container {
		width: 20vh;
		height: 20vh;
	}

	.bio-name {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 10px;
		color: white;
		font-size: 5vh;
	}

	.bio-facts {
		display: flex;
		flex-direction: column;
		justify-content: center;
		width: 100%;
		gap: 1vh;
	}
</style>
