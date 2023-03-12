<script>
	import { css } from '@emotion/css';

	import familyTreeData from '../../../stores/familyTreeData';
	import stylingConstants from '../../../stores/stylingConstants';
	import { getPersonIndexById } from '../../../logic/personManagement';
	import { unsetActiveNodeEditId } from '../../../logic/uiManagement.js';

	export let sPersonId;
	export let bIsActivePerson = false;
	export let sInputValue;
	export let bEnabled = false;

	const startEditText = (el) => {
		el.focus();
		el.select();
	};

	const onBlurAction = (event) => {
		writeNameInputValueToStore(event.target.value);
	};

	const onEnterKeyAction = (event) => {
		if (event.keyCode === 13) {
			writeNameInputValueToStore(event.target.value);
			unsetActiveNodeEditId();
			deselectText();
		}
	};

	const writeNameInputValueToStore = (sName) => {
		familyTreeData.update((currentValue) => {
			let personIndex = getPersonIndexById(sPersonId);
			currentValue.people[personIndex].name = sName;
			return currentValue;
		});
	};

	let input;
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
		on:keydown|stopPropagation={onEnterKeyAction}
		on:blur={onBlurAction}
		disabled={!bEnabled}
		use:startEditText
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
