<script>
	import { css } from '@emotion/css';

	import familyTreeData from '../../stores/familyTreeData';
	import stylingConstants from '../../stores/stylingConstants';
	import { getPersonIndexById } from '../../logic/personManagement';

	export let sPersonId = undefined;
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

	const textInputDynamicClass = css`
		border: 2px solid ${stylingConstants.colors.sActiveInputHighlightColor};
	`;
</script>

<div id="text-input-container" class="text-input-container">
	<input
		type="text"
		id="text-input"
		class="{textInputDynamicClass} text-input"
		bind:value={sInputValue}
		on:click|stopPropagation
		on:keydown|stopPropagation={onKeyDownAction}
		on:blur={onBlurAction}
		disabled={!bEnabled}
		use:startEditText
	/>
</div>

<style>
	.text-input-container {
		display: flex;
	}

	.text-input {
		width: 100%;
		text-align: center;
		outline: none;
	}

	.text-input:disabled {
		background-color: white;
		border: 2px solid transparent;
	}
</style>
