<script>
	import { saveToRepoStatus } from '$lib/states/ui-state';

	import { writeCurrentFamilyTreeDataToRepo } from '$lib/persistence-management';
	import { getNotificationConfigFromRepoState } from '$lib/ui-management';

	import { repoStateStrings } from '$lib/components/strings';

	import Button from '$lib/components/Button.svelte';
	import NotificationBanner from '$lib/components/Notifications/NotificationBanner.svelte';

	let showBanner;
	let message;
	let color;

	let onSaveButtonClick = () => {
		writeCurrentFamilyTreeDataToRepo();
	};

	$: {
		showBanner =
			$saveToRepoStatus !== repoStateStrings.undefined &&
			$saveToRepoStatus !== repoStateStrings.saved &&
			$saveToRepoStatus !== undefined;
		// when the banner is shown, make sure page is scrolled up
		if (showBanner) {
			window.scrollTo(window.scrollX, 0);
		}

		// success messages get a delay before dismissing
		if (
			$saveToRepoStatus === repoStateStrings.loadSuccessful ||
			$saveToRepoStatus === repoStateStrings.saveSuccessful
		) {
			setTimeout(() => {
				saveToRepoStatus.set(repoStateStrings.undefined);
			}, 2000);
		}
	}

	saveToRepoStatus.subscribe(() => {
		message = getNotificationConfigFromRepoState().message;
		color = getNotificationConfigFromRepoState().color;
	});
</script>

{#if showBanner}
	<NotificationBanner {message} {color} standalone={false}>
		{#if $saveToRepoStatus === repoStateStrings.unsavedChanges}
			<Button
				buttonText={'Save'}
				onClickFunction={onSaveButtonClick}
				overrideFontSize={'1.35vh'}
				overridePadding={'0.5vh'}
			/>
		{/if}
	</NotificationBanner>
{/if}
