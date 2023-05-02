<script>
	import { personDetailStrings } from '../../strings';
	import uiState from '../../../stores/ui-state';

	import Avatar from '../../NodeView/PersonNode/Avatar.svelte';
	import AltNames from './AltNames.svelte';
	import FieldContainer from './FieldContainer.svelte';
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
        </FieldContainer>
        <FieldContainer label={personDetailStrings.birthdate}>
        </FieldContainer>
        <FieldContainer label={personDetailStrings.birthplace}>
        </FieldContainer>
        <FieldContainer label={personDetailStrings.hometown}>
        </FieldContainer>
        <FieldContainer label={personDetailStrings.deceased}>
        </FieldContainer>
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

	.bio-fact {
		background-color: darkgray;
	}
</style>
