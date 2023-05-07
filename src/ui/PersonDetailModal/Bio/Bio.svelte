<script>
	import { personDetailStrings } from '../../strings';
	import { gender } from '../../../schemas/person';
	import uiState from '../../../stores/ui-state';
	import tempState from '../../../stores/temp-state';

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

	$: {
		if ($tempState.bioEditPersonId === personId) {
			isBioEditActive = true;
		} else {
			isBioEditActive = false;
		}
	}
</script>

<div id="bio-content-container" class="bio-content-container">
	<div id="bio-edit-toolbar" class="bio-edit-toolbar">
		<EditBioButton
			{personId}
			{isBioEditActive}
			{initializeAllInputs}
			{saveAllInputs}
			{discardAllInputs}
		/>
	</div>
	<div id="bio-avatar-container" class="bio-avatar-container">
		<Avatar />
	</div>
	<div id="bio-name" class="bio-name">
		{$uiState.activePerson.name}
	</div>
	<div id="bio-facts" class="bio-facts">
		<FieldContainer label={personDetailStrings.altNames}>
			<AltNames />
		</FieldContainer>

		<FieldContainer label={personDetailStrings.gender}>
			<Selector
				bind:inputValue={genderInputValue}
				isEnabled={isBioEditActive}
				optionsGroupObject={genderOptions}
				optionValueKey="id"
			/>
		</FieldContainer>

		<FieldContainer label={personDetailStrings.birthdate}>
			<DatePicker bind:inputValue={birthdateInputValue} isEnabled={isBioEditActive} />
		</FieldContainer>

		<FieldContainer label={personDetailStrings.birthplace}>
			<TextInput bind:inputValue={birthplaceInputValue} isEnabled={isBioEditActive} />
		</FieldContainer>

		<FieldContainer label={personDetailStrings.hometown}>
			<TextInput bind:inputValue={hometownInputValue} isEnabled={isBioEditActive} />
		</FieldContainer>

		<Checkbox label="Deceased?" isChecked={$uiState.activePerson.deceased} />
		{#if $uiState.activePerson.deceased}
			<div id="deceased-details-container" class="deceased-details-container">
				<FieldContainer label={personDetailStrings.deathdate}>
					<DatePicker bind:inputValue={birthdateInputValue} isEnabled={isBioEditActive} />
				</FieldContainer>
				<FieldContainer label={personDetailStrings.deathplace}>
					<TextInput bind:inputValue={birthplaceInputValue} isEnabled={isBioEditActive} />
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

	.bio-edit-toolbar {
		display: grid;
		justify-content: right;
		width: 100%;
		gap: 1vw;
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
