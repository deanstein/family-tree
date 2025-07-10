<script>
	import { css } from '@emotion/css';

	import { persistenceStatus } from '$lib/states/family-tree-state';
	import { isTreeEditActive, nodeEditId } from '$lib/states/temp-state';
	import { showChooseTreeModal, showChooseTreeModalCloseButton } from '$lib/states/ui-state';

	import Button from '$lib/components/Button.svelte';
	import ButtonIconographic from './ButtonIconographic.svelte';
	import SaveStateBanner from '$lib/components/Notifications/SaveStateBanner.svelte';
	import stylingConstants from '$lib/components/styling-constants';

	let headerLeftFlankCss;

	// clicking on the icon shows the choose tree modal
	const onClickIcon = () => {
		showChooseTreeModal.set(true);
		// the choose tree modal will show its close button from this point forward
		showChooseTreeModalCloseButton.set(true);
	};

	const onClickEditTreeButton = () => {
		isTreeEditActive.set(!$isTreeEditActive);
	};

	const headerContainerCss = css`
		height: ${stylingConstants.sizes.headerHeight};
	`;

	$: {
		headerLeftFlankCss = css`
			flex: ${!$persistenceStatus ? 1 : 0};
		`;
	}
</script>

<div class="header-container {headerContainerCss}">
	<div class="header-content">
		<div class="header-left-flank {headerLeftFlankCss}" />
		<div class="header-center">
			<ButtonIconographic
				height={stylingConstants.sizes.nHeaderHeight - 2 * stylingConstants.sizes.nPadding + 'svh'}
				onClickFunction={onClickIcon}
				altText="Choose a Family Tree"
			/>
		</div>
		<div class="header-right-flank">
			<SaveStateBanner />
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
