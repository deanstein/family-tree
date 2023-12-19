<script>
	import { css } from '@emotion/css';

	import tempState from '$lib/stores/temp-state';
	import uiState from '$lib/stores/ui-state';

	import { toggleBuildMode } from '$lib/temp-management';

	import { repoStateStrings } from '$lib/components/strings';
	import stylingConstants from '$lib/components/styling-constants';

	import Button from '$lib/components/Button.svelte';
	import SaveStateBanner from '$lib/components/Notifications/SaveStateBanner.svelte';

	let headerLeftFlankDynamicClass;

	const buildModeButtonOnClickAction = () => {
		toggleBuildMode();
	};

	const headerContainerDynamicClass = css`
		height: ${stylingConstants.sizes.headerHeight};
	`;

	const headerLogoContainerDynamicClass = css`
		height: ${stylingConstants.sizes.nHeaderHeight - 2 * stylingConstants.sizes.nPadding + 'vh'};
	`;

	$: {
		headerLeftFlankDynamicClass = css`
			flex: ${$uiState.saveToRepoStatus === repoStateStrings.undefined || !$uiState.saveToRepoStatus
				? 1
				: 0};
		`;
	}
</script>

<div class="{headerContainerDynamicClass} header-container">
	<div class="header-content">
		<div class="{headerLeftFlankDynamicClass} header-left-flank" />
		<div class="header-center">
			<img
				src="./img/family-tree-icon.png"
				class={headerLogoContainerDynamicClass}
				alt="family tree icon"
			/>
		</div>
		<div class="header-right-flank">
			{#if $tempState.nodeActionsModalPersonId === undefined}
				<SaveStateBanner />
			{/if}
			<div class="edit-tree-button-container">
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
