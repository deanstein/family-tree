<script>
	import { get } from 'svelte/store';

	import { showAdminLoginModal } from '$lib/states/ui-state';
	import { fetchIsAdmin } from '$lib/persistence-management';
	import { authFormFirstName, authFormLastName } from '$lib/states/temp-state';

	import AuthenticateTreeForm from './AuthenticateTreeForm.svelte';
	import Modal from './Modal.svelte';
	import stylingConstants from '../styling-constants';

	// bind variables to the form component
	let showErrorMessage = false;
	let showLoadingMessage = false;

	const onClickCloseButton = () => {
		showAdminLoginModal.set(false);
	};

	const onClickSubmitButton = async () => {
		showLoadingMessage = true;
		const isAdmin = await fetchIsAdmin(get(authFormFirstName), get(authFormLastName));
		console.log('is admin', isAdmin); // Debugging log

		if (isAdmin && isAdmin.success) {
			showAdminLoginModal.set(false);
			showLoadingMessage = false;
		} else {
			showErrorMessage = true;
			showLoadingMessage = false;
		}
	};
</script>

<Modal
	title={'Admin Only'}
	subtitle={'This action requires admin access.'}
	zIndex={stylingConstants.zIndices.authenticateTreeModalZIndex}
	{onClickCloseButton}
>
	<div class="authenticate-tree-modal-content" slot="modal-content-slot">
		<AuthenticateTreeForm
			buttonText="Log in as Admin"
			buttonFaIcon="fa-pencil"
			onClickButtonFunction={onClickSubmitButton}
			{showLoadingMessage}
			errorMessage={"Sorry, you're not an admin!"}
			{showErrorMessage}
		/>
	</div>
</Modal>
