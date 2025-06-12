<script>
	import { get } from 'svelte/store';

	import { postAdminLoginFunction, showAdminLoginModal } from '$lib/states/ui-state';
	import { fetchIsAdmin } from '$lib/persistence-management';
	import { authFormFirstName, authFormLastName, isAdminMode } from '$lib/states/temp-state';

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
		const isAdminResponse = await fetchIsAdmin(get(authFormFirstName), get(authFormLastName));

		if (isAdminResponse.success && isAdminResponse.isAdmin) {
			// set admin mode to true
			// so no further logins are required
			isAdminMode.set(true);
			showAdminLoginModal.set(false);
			showLoadingMessage = false;
			// execute whatever action was invoked before this dialog was shown
			const postLoginFunction = get(postAdminLoginFunction);
			if (postLoginFunction) {
				postLoginFunction();
				postAdminLoginFunction.set(undefined);
			}
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
