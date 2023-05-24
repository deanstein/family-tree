<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../../styling-constants';

	export let bIsActivePerson = false;
	export let sInputValue;
	export let bEnabled = false;

	let input;

	const nameInputContainerDynamicClass = css`
		padding-top: ${stylingConstants.sizes.padding};
		padding-left: ${stylingConstants.sizes.padding};
		padding-right: ${stylingConstants.sizes.padding};
		padding-bottom: ${bIsActivePerson ? stylingConstants.sizes.padding : '0px'};
		margin-bottom: ${bIsActivePerson ? '0px' : '-4px'};
	`;

	const nameInputDynamicClass = css`
		font-size: ${stylingConstants.sizes.personNodeFontSize};
		border: 2px solid ${stylingConstants.colors.activeColor};
	`;
</script>

<div id="name-input-container" class="{nameInputContainerDynamicClass} name-input-container">
	<input
		type="text"
		id="name-input"
		class="{nameInputDynamicClass} name-input"
		bind:this={input}
		bind:value={sInputValue}
		on:click|stopPropagation
		disabled={!bEnabled}
	/>
</div>

<style>
	.name-input-container {
		display: flex;
	}

	.name-input {
		width: 100%;
		text-align: center;
		outline: none;
	}

	.name-input:disabled {
		background-color: white;
		border: 2px solid transparent;
	}
</style>
