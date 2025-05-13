<script>
	import { css } from '@emotion/css';

	import { activePerson } from '$lib/states/family-tree-state';

	import stylingConstants from '$lib/components/styling-constants';

	import TextInput from '$lib/components/TextInput.svelte';

	export let isEnabled = true;
	export let inputValue = 'John Doe';
	export let age = 0;

	const nameDisabledCss = css`
		color: ${stylingConstants.colors.textColor};
	`;

	const ageCss = css`
		color: ${stylingConstants.colors.textColor};
	`;
</script>

<div class="name-age-container">
	{#if isEnabled}
		<div class="name-enabled">
			<TextInput bind:inputValue fontSizeOverride="5vh" textAlignOverride="center" />
		</div>
	{:else}
		<div class="name-disabled {nameDisabledCss}">
			{$activePerson.name}
		</div>
	{/if}
	<div class="age {ageCss}">
		{'Age: ' + (isNaN(age) ? '?' : age)}
	</div>
	<div class="age deceased {ageCss}">
		{$activePerson.deceased ? ' (deceased)' : ''}
	</div>
</div>

<style>
	.name-age-container {
		width: 100%;
		margin-bottom: 1vh;
	}

	.name-disabled {
		text-align: center;
		border: 2px solid transparent;
		padding: 14px;
		font-size: 5vh;
	}

	.name-enabled {
		width: 100%;
		padding: 10px 0 10px 0;
	}

	.age {
		text-align: center;
		font-style: italic;
	}

	.deceased {
		font-size: 12px;
	}
</style>
