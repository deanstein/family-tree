<script>
	import { showAuthenticateTreeModal } from '$lib/states/ui-state';

	import AuthenticateTreeForm from './AuthenticateTreeForm.svelte';
	import Modal from './Modal.svelte';
	import stylingConstants from '../styling-constants';

	// bind variables to the form component
	let showErrorMessage = false;
	let showLoadingMessage = false;

	const onClickCloseButton = () => {
		showAuthenticateTreeModal.set(false);
	};

	const onClickSubmitButton = async () => {};
</script>

<Modal
	title={'Authentication Required'}
	subtitle={'Enter the following information to edit this tree'}
	zIndex={stylingConstants.zIndices.authenticateTreeModalZIndex}
	{onClickCloseButton}
>
	<div class="authenticate-tree-modal-content" slot="modal-content-slot">
		<AuthenticateTreeForm
			buttonText="Edit Family Tree"
			buttonFaIcon="fa-pencil"
			onClickButtonFunction={onClickSubmitButton}
			{showLoadingMessage}
			{showErrorMessage}
		/>
	</div>
</Modal>
