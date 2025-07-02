<script>
	import { customDeleteMessage, showDeleteModal } from '$lib/states/ui-state';

	import { JDGButton } from 'jdg-ui-svelte';
	import Modal from './Modal.svelte';
	import ModalActionsBar from './ModalActionsBar.svelte';
	import stylingConstants from '../styling-constants';

	// this may be overwritten by the custom message in ui-state
	const defaultMessage = 'Are you sure?';

	const onClickDeleteButton = () => {
		showDeleteModal.set(false);
	};

	const onClickCancelButton = () => {
		showDeleteModal.set(false);
	};
</script>

<Modal
	title={'Delete'}
	subtitle={null}
	zIndex={stylingConstants.zIndices.authenticateTreeModalZIndex}
	transparency="0.9"
>
	<div slot="modal-content-slot" class="delete-message">
		{#if $customDeleteMessage}
			{$customDeleteMessage}
		{:else}
			{defaultMessage}
		{/if}
	</div>

	<div slot="modal-toolbar-slot">
		<ModalActionsBar>
			<JDGButton
				label="Delete"
				onClickFunction={onClickDeleteButton}
				faIcon={null}
				backgroundColor={stylingConstants.colors.buttonColorDelete}
			/>
			<JDGButton label="Cancel" onClickFunction={onClickCancelButton} faIcon={null} />
		</ModalActionsBar>
	</div>
</Modal>

<style>
	.delete-message {
		white-space: pre-line;
		text-align: center;
	}
</style>
