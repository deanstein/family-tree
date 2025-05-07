<script>
	import { css } from '@emotion/css';
	import { get } from 'svelte/store';

	import { isTreeEditActive, nodeEditId } from '$lib/states/temp-state';
	import tempState from '$lib/stores/temp-state';
	import uiState from '$lib/stores/ui-state';

	import { repoStateStrings } from '$lib/components/strings';
	import stylingConstants from '$lib/components/styling-constants';

	import Button from '$lib/components/Button.svelte';
	import SaveStateBanner from '$lib/components/Notifications/SaveStateBanner.svelte';

	let headerLeftFlankCss;

	const onClickEditTreeButton = () => {
		isTreeEditActive.set(!get(isTreeEditActive));
	};

	const headerContainerCss = css`
		height: ${stylingConstants.sizes.headerHeight};
	`;

	const headerLogoContainerCss = css`
		height: ${stylingConstants.sizes.nHeaderHeight - 2 * stylingConstants.sizes.nPadding + 'vh'};
	`;

	$: {
		headerLeftFlankCss = css`
			flex: ${$uiState.saveToRepoStatus === repoStateStrings.undefined || !$uiState.saveToRepoStatus
				? 1
				: 0};
		`;
	}
</script>

<div class="header-container {headerContainerCss}">
	<div class="header-content">
		<div class="header-left-flank {headerLeftFlankCss}" />
		<div class="header-center">
			<img src="./img/family-tree-icon.png" class={headerLogoContainerCss} alt="family tree icon" />
		</div>
		<div class="header-right-flank">
			{#if $nodeEditId === undefined}
				<SaveStateBanner />
			{/if}
			<div class="edit-tree-button-container">
				<Button
					onClickFunction={onClickEditTreeButton}
					buttonText={$isTreeEditActive ? 'Done Editing' : 'Edit Tree'}
					overrideBackgroundColor={$isTreeEditActive
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
