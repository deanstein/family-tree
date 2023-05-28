<script>
	import { writeCurrentFamilyTreeDataToRepo } from '../../logic/persistence-management';
	import {
		getNotificationConfigFromRepoState,
		setCachedActivePerson,
		setRepoState
	} from '../../logic/ui-management';
	import uiState from '../../stores/ui-state';
	import { repoStateStrings } from '../strings';
	import { areObjectsEqual } from '../../logic/utils';

	import NotificationBanner from './NotificationBanner.svelte';
	import Button from '../Button.svelte';

	let unsavedChanges;
	let message;
	let color;

	let onSaveButtonClick = () => {
		// set the cache to the current active user to clear the save flag
		setCachedActivePerson();
		writeCurrentFamilyTreeDataToRepo('8890');
	};

	$: {
		// success messages get a delay before dismissing
		if (
			$uiState.saveToRepoStatus === repoStateStrings.loadSuccessful ||
			$uiState.saveToRepoStatus === repoStateStrings.saveSuccessful
		) {
			setTimeout(() => {
				setRepoState(repoStateStrings.undefined);
			}, 2000);
		}
	}

	uiState.subscribe(() => {
		message = getNotificationConfigFromRepoState().message;
		color = getNotificationConfigFromRepoState().color;
	});
</script>

{#if $uiState.saveToRepoStatus != repoStateStrings.undefined && $uiState.saveToRepoStatus != repoStateStrings.saved && $uiState.saveToRepoStatus != undefined}
	<NotificationBanner {message} {color}>
		{#if $uiState.saveToRepoStatus === repoStateStrings.unsavedChanges}
			<Button
				buttonText={'Save'}
				onClickFunction={onSaveButtonClick}
				overrideFontSize={'1.35vh'}
				overridePadding={'0.5vh'}
			/>
		{/if}
	</NotificationBanner>
{/if}

<style>
</style>
