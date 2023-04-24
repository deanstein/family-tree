<script>
	import { css } from '@emotion/css';
	import Portal from 'svelte-portal';

	import familyTreeData from '../../stores/familyTreeData';
	import uiState from '../../stores/uiState';
	import stylingConstants from '../stylingConstants';

	import Overlay from '../NodeView/Overlay.svelte';
	import { hidePersonDetailView } from '../../logic/uiManagement';
	import Button from '../Button.svelte';

	const showPersonDetailViewContainerDynamicClass = css`
		z-index: ${stylingConstants.zIndices.nPersonNodeEditZIndex + 1};
	`;

	const closeButtonOnClick = () => {
		hidePersonDetailView();
	};
</script>

{#if $uiState.showPersonDetailView}
	<div id="person-detail-view-outer-container" class="person-detail-view-outer-container">
		<div
			id="person-detail-view-content-container"
			class="person-detail-view-content-container {showPersonDetailViewContainerDynamicClass}"
		>
			<div id="person-detail-header" class="person-detail-header">
				<div id="welcome-message" class="person-detail-welcome-message">
					{$uiState.activePerson.name}
				</div>
				<div id="coming-soon-message" class="coming-soon-message">
					Person detail view coming soon.
				</div>
			</div>

			<Button buttonText={'Close'} onClickFunction={closeButtonOnClick} />
		</div>
		<Portal target="#app-container">
			<Overlay />
		</Portal>
	</div>
{/if}

<style>
	.person-detail-view-outer-container {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100vw;
	}

	.person-detail-view-content-container {
		display: flex;
		flex-direction: column;
		width: 50vw;
		height: 50vh;
		background-color: rgba(48, 48, 48, 0.8);
	}

	.person-detail-header {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 10px;
		color: white;
	}

	.person-detail-welcome-message {
		font-size: 5vh;
		display: flex;
		justify-content: center;
		padding: 10px;
		color: white;
	}

	.coming-soon-message {
		font-size: 2vh;
		display: flex;
		justify-content: center;
		padding: 10px;
		color: white;
	}
</style>
