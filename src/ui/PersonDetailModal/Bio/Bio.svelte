<script>
	import { personDetailStrings } from '../../strings';
	import { gender } from '../../../schemas/person';
	import uiState from '../../../stores/ui-state';

	import Avatar from '../../NodeView/PersonNode/Avatar.svelte';
	import AltNames from './AltNames.svelte';
	import DatePicker from './DatePicker.svelte';
	import FieldContainer from './FieldContainer.svelte';
	import Selector from '../../Select.svelte';
	import TextInput from '../../TextInput.svelte';

	let selectedBirthdate;

	const genderOptions = {
		label: 'Gender:',
		gender
	};
</script>

<div id="bio-content-container" class="bio-content-container">
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
			<Selector optionsGroupObject={genderOptions} optionValueKey="id" />
		</FieldContainer>
		<FieldContainer label={personDetailStrings.birthdate}>
			<DatePicker />
		</FieldContainer>
		<FieldContainer label={personDetailStrings.birthplace}>
			<TextInput />
		</FieldContainer>
		<FieldContainer label={personDetailStrings.hometown}>
			<TextInput />
		</FieldContainer>
		<FieldContainer label={personDetailStrings.deceased} />
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
