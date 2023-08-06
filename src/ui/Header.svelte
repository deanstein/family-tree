<script>
	import { toggleBuildMode } from '../logic/temp-management';
	import tempState from '../stores/temp-state';

	import Button from './Button.svelte';

	const buildModeButtonOnClickAction = () => {
		toggleBuildMode();
	};
</script>

<div id="header-container" class="header-container">
	<Button
		onClickFunction={buildModeButtonOnClickAction}
		buttonText={$tempState.buildMode ? 'End Build Mode' : 'Start Build Mode'}
	/>
</div>

<style>
	.header-container {
		display: flex;
		justify-content: center;
	}
</style>
