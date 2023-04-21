<script>
	import { getNotificationConfigFromRepoState, setRepoState } from '../../logic/uiManagement';
	import uiState from '../../stores/uiState';

	import NotificationBanner from './NotificationBanner.svelte';
	import { repoStateStrings } from '../strings';

	let message;
	let color;

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
	}

	uiState.subscribe(() => {
		message = getNotificationConfigFromRepoState().message;
		color = getNotificationConfigFromRepoState().color;
	});
</script>

{#if $uiState.saveToRepoStatus != repoStateStrings.undefined && $uiState.saveToRepoStatus != repoStateStrings.saved && $uiState.saveToRepoStatus != undefined}
	<NotificationBanner {message} {color} />
{/if}

<style>
</style>
