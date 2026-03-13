<script>
	import { get } from 'svelte/store';

	import { clearLastTreeChoice } from '$lib/persistence-management';
	import { activePerson, persistenceStatus } from '$lib/states/family-tree-state';
	import { clearAdminSession, bioEditId } from '$lib/states/temp-state';
	import {
		showAdminLoginModal,
		showChooseTreeModal,
		showDevTools,
		showStoreView
	} from '$lib/states/ui-state';
	import { instantiateNewFamilyTreeAndSetActive } from '$lib/tree-management';

	import { enableScrolling, disableScrolling, scrollToTopAndCenter } from '$lib/ui-management';

	import { persistenceStrings } from '$lib/components/strings';

	import DevToolbar from '$lib/components/DevTools/DevToolbar.svelte';
	import DevToolsSubheader from '$lib/components/DevTools/DevToolsSubheader.svelte';
	import StoreView from '$lib/components/DevTools/StoreView.svelte';

	const toggleChooseTreeModal = () => {
		showChooseTreeModal.set(!get(showChooseTreeModal));
		if (get(showChooseTreeModal)) {
			scrollToTopAndCenter();
			if (!get(showDevTools)) {
				disableScrolling();
			}
		} else {
			enableScrolling();
		}
	};

	const testSaveNotification = () => {
		persistenceStatus.set(persistenceStrings.unsavedChanges);
	};

	const setBioEditActive = () => {
		bioEditId.set($activePerson.id);
	};

	const onClickSignOut = () => {
		clearAdminSession();
		clearLastTreeChoice();
		instantiateNewFamilyTreeAndSetActive();
		showChooseTreeModal.set(true);
		scrollToTopAndCenter();
		if (!get(showDevTools)) {
			disableScrolling();
		}
	};
</script>

<div class="dev-tools-outer-container">
	<div class="dev-tools-title">DEV TOOLS</div>
	<DevToolsSubheader subheaderTitle="Admin Tools" />
	<DevToolbar>
		<button on:click={onClickSignOut}>Sign out (require login again)</button>
	</DevToolbar>
	<DevToolsSubheader subheaderTitle="Interface Tools" />
	<DevToolbar>
		<button on:click={toggleChooseTreeModal}>
			{!$showChooseTreeModal ? 'Show' : 'Hide'} Choose Tree Modal
		</button>
		<button on:click={testSaveNotification}> Test Save Notification </button>
		<button on:click={setBioEditActive}> Set Bio Edit Active </button>
		<button
			on:click={() => {
				$showAdminLoginModal = !$showAdminLoginModal;
			}}
		>
			Show Authenticate Tree Modal
		</button>
	</DevToolbar>
	<DevToolsSubheader subheaderTitle="Store Tools" />
	<DevToolbar>
		<button
			on:click={() => {
				$showStoreView = !$showStoreView;
			}}
		>
			{!$showStoreView ? 'Show' : 'Hide'} Store View
		</button>
	</DevToolbar>
	{#if $showStoreView}
		<StoreView />
	{/if}
</div>

<style>
	.dev-tools-title {
		vertical-align: middle;
		align-items: center;
		justify-content: center;
		display: inline-flex;
		width: 100%;
		height: 4vh;
		margin-top: 10px;
		font-weight: bold;
		background-color: #cdbdba;
		color: #515151;
	}
</style>
