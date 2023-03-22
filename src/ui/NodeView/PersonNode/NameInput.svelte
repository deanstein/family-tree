<script>
	import { css } from '@emotion/css';

	import stylingConstants from '../../../stores/stylingConstants';
	import {
		updateAvailablePeopleIdsFilteredArray
	} from '../../../logic/personManagement';
	import { endNodeEditingMode, setTempNodeEditName, unsetActiveNodeEditId } from '../../../logic/uiManagement.js';

	export let sPersonId;
	export let sRelationshipId;
	export let bIsActivePerson = false;
	export let sInputValue;
	export let bEnabled = false;

	let input;

	$: {
		// set the input value as the temporary value in the store when the input is enabled
		if (bEnabled) {
			setTempNodeEditName(sInputValue);
		}
	}

	const startEditText = (element) => {
		element.focus();
		element.select();
	};

	const onEnterKeyAction = (event) => {
		if (event.keyCode === 13) {
			endNodeEditingMode(sPersonId, sRelationshipId);
			deselectText();
		}
	};

	const onKeyUpAction = (event) => {
		setTempNodeEditName(event.target.value);
		updateAvailablePeopleIdsFilteredArray(event.target.value);
	};

	const deselectText = () => {
		input.selectionStart = input.selectionEnd;
	};

	const nameInputContainerDynamicClass = css`
		font-size: ${stylingConstants.sizes.personNodeFontSize};
		padding-top: ${stylingConstants.sizes.padding};
		padding-left: ${stylingConstants.sizes.padding};
		padding-right: ${stylingConstants.sizes.padding};
		padding-bottom: ${bIsActivePerson ? stylingConstants.sizes.padding : '0px'};
		margin-bottom: ${bIsActivePerson ? '0px' : '-2px'};
	`;

	const nameInputDynamicClass = css`
		border: 2px solid ${stylingConstants.colors.sActiveColor};
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
		on:keyup={onKeyUpAction}
		on:keydown|stopPropagation={onEnterKeyAction}
		disabled={!bEnabled}
		use:startEditText
	/>
</div>

<style>
	.name-input-container {
		display: flex;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
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
