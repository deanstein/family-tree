<script>
	import { css } from '@emotion/css';

	import familyTreeData from '../../stores/familyTreeData';
	import stylingConstants from '../../stores/stylingConstants';
	import { getPersonIndexById } from '../../logic/personManagement';

	export let sPersonId = undefined;
	export let bIsActivePerson = false;
	export let sInputValue;
	export let bEnabled = false;

	const startEditText = (el) => {
		el.focus();
		el.select();
	};

	const onKeyDownAction = (event) => {
		if (event.keyCode === 13) {
			event.target.blur();
		}
	};

	const onBlurAction = (event) => {
		const sCurrentInputValue = event.target.value;

		familyTreeData.update((currentValue) => {
			let personIndex = getPersonIndexById(sPersonId);
			currentValue.people[personIndex].name = sCurrentInputValue;
			return currentValue;
		});
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
		border: 2px solid ${stylingConstants.colors.sActiveInputHighlightColor};
	`;
</script>

<div id="name-input-container" class="{nameInputContainerDynamicClass} name-input-container">
	<input
		type="text"
		id="name-input"
		class="{nameInputDynamicClass} name-input"
		bind:value={sInputValue}
		on:click|stopPropagation
		on:keydown|stopPropagation={onKeyDownAction}
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
