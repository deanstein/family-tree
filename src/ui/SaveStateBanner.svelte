<script>
	import { getNotificationConfigFromSaveState } from '../logic/uiManagement';
	import uiState from '../stores/uiState';

	import NotificationBanner from './NotificationBanner.svelte';

	let message;
	let color;

	uiState.subscribe(() => {
		message = getNotificationConfigFromSaveState().message;
		color = getNotificationConfigFromSaveState().color;
	});
</script>

<NotificationBanner {message} {color} />

<style>
</style>
