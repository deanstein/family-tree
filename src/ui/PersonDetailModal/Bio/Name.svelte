<script>
	import { css } from '@emotion/css';
	import uiState from '../../../stores/ui-state';
	import stylingConstants from '../../styling-constants';
	import TextInput from '../../TextInput.svelte';

	export let isEnabled = true;
	export let inputValue = 'John Doe';

	const nameDisabledDynamicClass = css`
		color: ${stylingConstants.colors.textColor};
	`;
</script>

<div id="name-container" class="name-container">
	{#if isEnabled}
		<div id="name-enabled" class="name-enabled">
			<TextInput bind:inputValue fontSizeOverride="5vh" textAlignOverride="center" />
		</div>
	{:else}
		<div id="name-disabled" class="{nameDisabledDynamicClass} name-disabled">
			{$uiState.activePerson.name}
		</div>
	{/if}
</div>

<style>
	.name-container {
		width: 100%;
	}

	.name-disabled {
		text-align: center;
		border: 2px solid transparent;
		padding: 10px;
		margin-bottom: 1vh;
		font-size: 5vh;
	}

	.name-enabled {
		width: 100%;
		padding: 10px 0 10px 0;
		margin-bottom: 1vh;
	}
</style>
