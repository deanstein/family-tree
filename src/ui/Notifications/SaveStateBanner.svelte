<script>
	import { tempPw, writeCurrentFamilyTreeDataToRepo } from '../../logic/persistence-management';
	import { getNotificationConfigFromRepoState, setRepoState } from '../../logic/ui-management';
	import uiState from '../../stores/ui-state';
	import { repoStateStrings } from '../strings';

	import NotificationBanner from './NotificationBanner.svelte';
	import Button from '../Button.svelte';

	let showBanner;
	let message;
	let color;

	let onSaveButtonClick = () => {
		writeCurrentFamilyTreeDataToRepo(tempPw);
	};

	$: {
		showBanner =
			$uiState.saveToRepoStatus !== repoStateStrings.undefined &&
			$uiState.saveToRepoStatus !== repoStateStrings.saved &&
			$uiState.saveToRepoStatus !== undefined;
		// when the banner is shown, make sure page is scrolled up
		if (showBanner) {
			window.scrollTo(window.scrollX, 0);
		}

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

{#if showBanner}
	<NotificationBanner {message} {color} standalone={false}>
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
