<script>
	import { toggleBuildMode } from '../logic/temp-management';
	import tempState from '../stores/temp-state';

	import Button from './Button.svelte';

	const buildModeButtonOnClickAction = () => {
		toggleBuildMode();
	};
</script>

<div id="header-container" class="header-container">
	<div id="header-content" class="header-content">
		<Button
			onClickFunction={buildModeButtonOnClickAction}
			buttonText={$tempState.buildMode ? 'End Build Mode' : 'Start Build Mode'}
		/>
	</div>
</div>

<style>
	.header-container {
		position: absolute;
		width: 100vw;
	}

	.header-content {
		display: flex;
		justify-content: center;
	}
</style>
