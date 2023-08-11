<script>
	import { css } from '@emotion/css';

	import tempState from '../stores/temp-state';
	import stylingConstants from './styling-constants';

	import { toggleBuildMode } from '../logic/temp-management';

	import Button from './Button.svelte';
	import SaveStateBanner from './Notifications/SaveStateBanner.svelte';
	import uiState from '../stores/ui-state';

	const buildModeButtonOnClickAction = () => {
		toggleBuildMode();
	};

	const headerContainerDynamicClass = css`
		height: ${stylingConstants.sizes.headerHeight};
	`;

	const headerLogoContainerDynamicClass = css`
		height: ${stylingConstants.sizes.nHeaderHeight - 2 * stylingConstants.sizes.nPadding + 'vh'};
	`;
</script>

<div id="header-container" class="{headerContainerDynamicClass} header-container">
	<div id="header-content" class="header-content">
		<div id="header-left-flank" class="header-left-flank" />
		<div id="header-center" class="header-center">
			<img
				src="./img/family-tree-icon.png"
				id="family-tree-icon"
				class={headerLogoContainerDynamicClass}
				alt="family tree icon"
			/>
		</div>
		<div id="header-right-flank" class="header-right-flank">
			{#if $uiState.personIdForNodeEdit === undefined}
				<SaveStateBanner />
			{/if}
			<div id="edit-tree-button-container" class="edit-tree-button-container">
				<Button
					onClickFunction={buildModeButtonOnClickAction}
					buttonText={$tempState.buildMode ? 'Done Editing' : 'Edit Tree'}
					overrideBackgroundColor={$tempState.buildMode
						? stylingConstants.colors.buttonColorDone
						: stylingConstants.colors.buttonColorPrimary}
				/>
			</div>
		</div>
	</div>
</div>

<style>
	.header-container {
		background: rgb(245, 245, 245);
	}

	.header-content {
		display: flex;
		height: 100%;
		justify-content: center;
		align-items: center;
	}

	.header-left-flank {
		display: flex;
		flex: 1;
		gap: 0.5vw;
		padding: 0 0.5vw 0 0.5vw;
	}

	.header-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.header-right-flank {
		display: flex;
		flex: 1;
		justify-content: right;
		align-items: center;
		gap: 0.5vw;
		padding: 0 0.5vw 0 0.5vw;
	}

	.edit-tree-button-container {
		flex-shrink: 0;
	}
</style>
