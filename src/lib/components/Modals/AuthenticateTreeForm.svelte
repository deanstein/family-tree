<script>
	import { css } from '@emotion/css';
	//@ts-expect-error
	import { lightenColor } from 'jdg-ui-svelte/jdg-utils.js';

	import { authFormBirthdate, authFormFirstName, authFormLastName } from '$lib/states/temp-state';

	import { JDGButton } from 'jdg-ui-svelte';
	import InputContainer from '../InputContainer.svelte';
	import TextInput from '../TextInput.svelte';
	import DatePicker from '../DatePicker.svelte';
	import stylingConstants from '../styling-constants';

	export let buttonText = 'Authenticate Tree';
	export let buttonFaIcon = 'fa-key';
	export let onClickButtonFunction;
	// status messaging
	export let showLoadingMessage = false;
	export let loadingMessage = 'Checking your credentials...';
	export let showErrorMessage = false;
	export let errorMessage = "Sorry, it appears you don't have access to this family tree.";

	const onFirstNameInput = (event) => {
		authFormFirstName.set(event.target.value);
	};

	const onLastNameInput = (event) => {
		authFormLastName.set(event.target.value);
	};

	const onBirthdateInput = (event) => {
		authFormBirthdate.set(event.target.value);
	};

	const formCss = css`
		background-color: ${lightenColor(stylingConstants.colors.personNodeGradient3, 0.45)};
	`;
</script>

<form on:submit|preventDefault={onClickButtonFunction} class="form {formCss}">
	<InputContainer label="First Name">
		<TextInput onInputFunction={onFirstNameInput} placeholder={'John'} />
	</InputContainer>
	<InputContainer label="Last Name">
		<TextInput onInputFunction={onLastNameInput} placeholder={'Doe'} />
	</InputContainer>
	<InputContainer label="Birthdate">
		<DatePicker onInputFunction={onBirthdateInput} />
	</InputContainer>

	<JDGButton
		onClickFunction={onClickButtonFunction}
		label={buttonText}
		faIcon={buttonFaIcon}
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
