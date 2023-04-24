<script>
	import { writeCurrentFamilyTreeDataToRepo } from '../../logic/persistenceManagement';
	import { getNotificationConfigFromRepoState, setRepoState } from '../../logic/uiManagement';
	import uiState from '../../stores/uiState';
	import { repoStateStrings } from '../strings';
	import { areObjectsEqual } from '../../logic/utils';

	import NotificationBanner from './NotificationBanner.svelte';
	import Button from '../Button.svelte';

	let unsavedChanges;
	let message;
	let color;

	let onSaveButtonClick = () => {
		writeCurrentFamilyTreeDataToRepo('8890');
	};

	$: {
		// success messages get a 5-second delay before dismissing
		if (
			$uiState.saveToRepoStatus === repoStateStrings.loadSuccessful ||
			$uiState.saveToRepoStatus === repoStateStrings.saveSuccessful
		) {
			setTimeout(() => {
				setRepoState(repoStateStrings.undefined);
			}, 1500);
		}

		// determine if there are unsved changes
		if (
			$uiState.saveToRepoStatus !== repoStateStrings.saving &&
			$uiState.saveToRepoStatus !== repoStateStrings.saved
		) {
			unsavedChanges = !areObjectsEqual($uiState.activePerson, $uiState.cachedActivePerson);
			if (unsavedChanges) {
				$uiState.unsavedChanges = true;
				$uiState.saveToRepoStatus = repoStateStrings.unsavedChanges;
			}
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
			<Button buttonText={'Save now'} onClickFunction={onSaveButtonClick} />
		{/if}
	</NotificationBanner>
{/if}

<style>
</style>
