<script>
	import { showDeleteConfirmationModal } from '$lib/states/ui-state';

	import { JDGButton } from 'jdg-ui-svelte';
	import Modal from './Modal.svelte';
	import ModalActionsBar from './ModalActionsBar.svelte';
	import stylingConstants from '../styling-constants';

	const defaultMessage = 'Are you sure?';

	const onClickDeleteButton = () => {
		showDeleteConfirmationModal.set(false);
	};

	const onClickCancelButton = () => {
		showDeleteConfirmationModal.set(false);
	};
</script>

<Modal
	title={'Delete'}
	subtitle={null}
	zIndex={stylingConstants.zIndices.authenticateTreeModalZIndex}
>
	<div slot="modal-content-slot">
		{#if defaultMessage}
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
</style>
