<script>
	import { css } from '@emotion/css';
	//@ts-expect-error
	import { lightenColor } from 'jdg-ui-svelte/jdg-utils.js';

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
	export const loadingMessage = 'Checking your credentials...';
	export let showErrorMessage = false;
	export const errorMessage = "Sorry, it appears you don't have access to this family tree.";

	let firstName = '';
	let lastName = '';
	let birthdate = '';

	const formCss = css`
		background-color: ${lightenColor(stylingConstants.colors.personNodeGradient3, 0.45)};
	`;
</script>

<form on:submit|preventDefault={onClickButtonFunction} class="form {formCss}">
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
