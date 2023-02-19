<script>
	import uiState from '../stores/uiState';

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

	function startEditText(el) {
		el.focus();
		el.select();
	}

	const onDoubleCLickAction = (event) => {
		bEnabled = true;

		if (event.target.disabled) {
			event.stopPropagation();
		} else {
		}
	};

	const onBlurAction = () => {
		uiState.update((currentValue) => {
			currentValue.personIdForNodeEdit = undefined;
			return currentValue;
		});
	};
</script>

<div id="text-input-container" class="text-input-container">
	<input
		type="text"
		value={sInputValue}
		id="text-input"
		class="text-input"
		on:click|stopPropagation
		on:keydown|stopPropagation
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
