<script>
	import { css } from '@emotion/css';
	//@ts-expect-error
	import { lightenColor } from 'jdg-ui-svelte/jdg-utils.js';

	import { persistenceStatus } from '$lib/states/family-tree-state';
	import { showChooseTreeModal } from '$lib/states/ui-state';
	import { isTreeEditActive } from '$lib/states/temp-state';

	import { fetchPrivateFamilyTreeAndSetActive } from '$lib/persistence-management';

	import { persistenceStrings } from '../strings';

	import { JDGButton } from 'jdg-ui-svelte';
	import InputContainer from '../InputContainer.svelte';
	import TextInput from '../TextInput.svelte';
	import DatePicker from '../DatePicker.svelte';
	import stylingConstants from '../styling-constants';

	let firstName = '';
	let lastName = '';
	let birthdate = '';

	// for local status messaging
	let showLoadingMessage = false;
	let loadingMessage = 'Checking your credentials...';
	let showErrorMessage = false;
	const errorMessage = "Sorry, it appears you don't have access to this family tree.";

	async function submitLoadFamilyTree() {
		// hide any errors from last attempt
		showErrorMessage = false;
		persistenceStatus.set(undefined);
		// show that credentials are being checked
		showLoadingMessage = true;
		// attempt to get the private family tree
		const privateFamilyTreeData = await fetchPrivateFamilyTreeAndSetActive(
			firstName,
			lastName,
			birthdate
		);
		// set the loading notification
		persistenceStatus.set(persistenceStrings.loading);

		if (privateFamilyTreeData) {
			// hide the modal
			showChooseTreeModal.set(false);
			// set edit mode to off
			isTreeEditActive.set(false);
			showErrorMessage = false;
			showLoadingMessage = false;
		} else {
			showErrorMessage = true;
			showLoadingMessage = false;
			persistenceStatus.set(persistenceStrings.loadFailed);
		}
	}

	const formCss = css`
		background-color: ${lightenColor(stylingConstants.colors.personNodeGradient3, 0.45)};
	`;
</script>

<form on:submit|preventDefault={submitLoadFamilyTree} class="form {formCss}">
	<InputContainer label="First Name">
		<TextInput bind:inputValue={firstName} placeholder={'John'} />
	</InputContainer>
	<InputContainer label="Last Name">
		<TextInput bind:inputValue={lastName} placeholder={'Doe'} />
	</InputContainer>
	<InputContainer label="Birthdate">
		<DatePicker bind:inputValue={birthdate} />
	</InputContainer>

	<JDGButton
		onClickFunction={submitLoadFamilyTree}
		label="Load Family Tree"
		faIcon="fa-people-roof"
		backgroundColor={stylingConstants.colors.personNodeGradient3}
		textColor="white"
	/>

	<!--- show loading message --->
	{#if showLoadingMessage}
		<div class="status-message loading">
			{loadingMessage}
		</div>
	{/if}
	<!--- show error if the creds aren't accepted by the backend --->
	{#if showErrorMessage}
		<div class="status-message error">
			{errorMessage}
		</div>
	{/if}
</form>

<style>
	.form {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 5px;
		padding: 10px;
		width: 100%;
		box-sizing: border-box;
	}

	.status-message {
		text-align: center;
		text-wrap: balance;
		font-size: 0.8rem;
	}

	.error {
		color: red;
	}

	.loading {
		color: goldenrod;
	}
</style>
