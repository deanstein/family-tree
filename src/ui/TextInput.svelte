<script>
	import familyTreeData from '../stores/familyTreeData';
    import uiState from '../stores/uiState';
    import { getPersonIndexById } from '../logic/personManagement';

	export let personId = undefined;
	export let sInputValue;

	let bEnabled;

	$: {
		if (personId == $uiState.personIdForNodeEdit) {
			bEnabled = true;
		} else {
			bEnabled = false;
		}
	}

	const startEditText = (el) => {
		el.focus();
		el.select();
	}

    const onKeyDownAction = (event) => {
        if (event.keyCode === 13) {
            event.target.blur()
        }
    }

	const onDoubleCLickAction = (event) => {
		bEnabled = true;

		if (event.target.disabled) {
			event.stopPropagation();
		} else {
		}
	};

	const onBlurAction = (event) => {
        const sCurrentInputValue = event.target.value;

        familyTreeData.update(currentValue => {
            let personIndex = getPersonIndexById(personId);
            currentValue.people[personIndex].name = sCurrentInputValue;
            return currentValue;
        })

		uiState.update(currentValue => {
			currentValue.personIdForNodeEdit = undefined;
			return currentValue;
		});
	};
</script>

<div id="text-input-container" class="text-input-container">
	<input
        bind:value={sInputValue}
		type="text"
		id="text-input"
		class="text-input"
		on:click|stopPropagation
		on:keydown|stopPropagation={onKeyDownAction}
		on:dblclick={onDoubleCLickAction}
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
	}

	.text-input:disabled {
		background-color: white;
		border: none;
	}
</style>
