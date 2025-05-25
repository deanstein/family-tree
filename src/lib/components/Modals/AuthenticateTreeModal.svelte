<script>
	import { showAuthenticateTreeModal } from '$lib/states/ui-state';

	import AuthenticateTreeForm from './AuthenticateTreeForm.svelte';
	import Modal from './Modal.svelte';
	import stylingConstants from '../styling-constants';

	const onClickCloseButton = () => {
		showAuthenticateTreeModal.set(false);
	};
</script>

<Modal
	title={'Authentication Required'}
	subtitle={'Enter the following information to write to this tree'}
	zIndex={stylingConstants.zIndices.authenticateTreeModalZIndex}
	{onClickCloseButton}
>
	<div class="authenticate-tree-modal-content" slot="modal-content-slot">
		<AuthenticateTreeForm />
	</div>
</Modal>
