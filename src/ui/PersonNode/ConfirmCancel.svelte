<script>
	export const endEditingModeAndSave = () => {
		uiState.update((currentValue) => {
			currentValue.personIdForNodeEdit = undefined;
			return currentValue;
		});
	};
</script>

<div id="confirm-cancel-container" class="confirm-cancel-container">
	<div id="confirm-button" class="confirm-button">Confirm Changes</div>
</div>

<style>
	.confirm-cancel-container {
		position: relative;
		width: 100%;
		height: 100%;
		float: right;
	}

	.confirm-button {
		background-color: green;
	}
</style>
