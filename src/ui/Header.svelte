<script>
	import { css } from '@emotion/css';
	import tempState from '../stores/temp-state';
	import stylingConstants from './styling-constants';

	import { toggleBuildMode } from '../logic/temp-management';

	import Button from './Button.svelte';

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
			<Button
				onClickFunction={buildModeButtonOnClickAction}
				buttonText={$tempState.buildMode ? 'End Build Mode' : 'Start Build Mode'}
			/>
		</div>
	</div>
</div>

<style>
	.header-container {
		position: absolute;
		width: 100vw;
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
	}

	.header-center {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.header-right-flank {
		display: flex;
		flex: 1;
		justify-content: center;
	}
</style>
