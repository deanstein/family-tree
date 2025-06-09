<script>
	import {
		activeFamilyTreeName,
		hasUnsavedChanges,
		persistenceStatus
	} from '$lib/states/family-tree-state';

	import { writeCurrentFamilyTreeDataToRepo } from '$lib/persistence-management';
	import { getNotificationConfigFromRepoState } from '$lib/ui-management';

	import { persistenceStrings } from '$lib/components/strings';

	import Button from '$lib/components/Button.svelte';
	import NotificationBanner from '$lib/components/Notifications/NotificationBanner.svelte';
	import { get } from 'svelte/store';
	import { isAdminMode } from '$lib/states/temp-state';
	import { postAdminLoginFunction, showAdminLoginModal } from '$lib/states/ui-state';

	let showBanner;
	let message;
	let color;

	let onSaveButtonClick = () => {
		// save is only possible in admin mode
		if (get(isAdminMode)) {
			writeCurrentFamilyTreeDataToRepo();
		} else {
			// pop the login modal
			showAdminLoginModal.set(true);
			// store the intended function in the state for execution later
			postAdminLoginFunction.set(writeCurrentFamilyTreeDataToRepo);
		}
	};

	// dynamic block for unsaved changes
	$: {
		// only set if unsaved changes AND there's an active family tree name for persistence
		if ($hasUnsavedChanges && $activeFamilyTreeName) {
			$persistenceStatus = persistenceStrings.unsavedChanges;
		}
	}

	// dynamic block for showing banner
	$: {
		showBanner =
			$persistenceStatus !== persistenceStrings.undefined &&
			$persistenceStatus !== persistenceStrings.saved &&
			$persistenceStatus !== undefined;
		// when the banner is shown, make sure page is scrolled up
		if (showBanner) {
			window.scrollTo(window.scrollX, 0);
		}

		// success messages get a delay before dismissing
		if (
			$persistenceStatus === persistenceStrings.loadSuccessful ||
			$persistenceStatus === persistenceStrings.saveSuccessful
		) {
			setTimeout(() => {
				persistenceStatus.set(undefined);
			}, 2000);
		}
	}

	persistenceStatus.subscribe(() => {
		message = getNotificationConfigFromRepoState().message;
		color = getNotificationConfigFromRepoState().color;
	});
</script>

{#if showBanner}
	<NotificationBanner {message} {color} standalone={false}>
		{#if $persistenceStatus === persistenceStrings.unsavedChanges}
			<Button
				buttonText={'Save'}
				onClickFunction={onSaveButtonClick}
				overrideFontSize={'1.35vh'}
				overridePadding={'0.5vh'}
			/>
		{/if}
	</NotificationBanner>
{/if}
