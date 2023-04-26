<script>
	import { css } from '@emotion/css';
	import Portal from 'svelte-portal';

	import familyTreeData from '../../stores/family-tree-data';
	import uiState from '../../stores/ui-state';
	import stylingConstants from '../styling-constants';

	import Overlay from '../NodeView/Overlay.svelte';
	import { hidePersonDetailView } from '../../logic/ui-management';
	import Button from '../Button.svelte';

	const containerDynamicClass = css`
		z-index: ${stylingConstants.zIndices.personDetailViewZIndex};
	`;

	const contentContainerDynamicClass = css``;

	const closeButtonOnClick = () => {
		hidePersonDetailView();
	};
</script>

{#if $uiState.showPersonDetailView}
	<div id="person-detail-view-outer-container" class="person-detail-view-outer-container">
		<div
			id="person-detail-view-content-container"
			class="person-detail-view-content-container {containerDynamicClass}"
		>
			<div id="person-detail-header" class="person-detail-header">
				<div id="person-detail-header-name" class="person-detail-header-name">
					{$uiState.activePerson.name}
				</div>
			</div>
			<div id="person-detail-content-container" class="person-detail-content-container">
				<div id="person-detail-fields-container" class="person-detail-subsection-container">
					<div id="person-detail-fields-header" class="person-detail-subsection-title">Basics</div>
					<div
						id="person-detail-fields-content-container"
						class="person-detail-subsection-content-container"
					>
						Test
					</div>
				</div>
				<div id="person-detail-timeline-container" class="person-detail-subsection-container">
					<div id="person-detail-timeline-header" class="person-detail-subsection-title">
						Timeline
					</div>
					<div
						id="person-detail-timeline-content-container"
						class="person-detail-subsection-content-container"
					>
						Test
					</div>
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
		width: 80vw;
		height: 80vh;
		background-color: rgba(48, 48, 48, 0.8);
	}

	.person-detail-header {
		display: flex;
		flex-direction: column;
		justify-content: center;
		padding: 10px;
		color: white;
	}

	.person-detail-header-name {
		font-size: 5vh;
		display: flex;
		justify-content: center;
		padding: 10px;
		color: white;
	}

	.person-detail-content-container {
		display: flex;
		flex-grow: 1;
		gap: 1vh;
		padding: 10px;
	}

	.person-detail-subsection-title {
		color: white;
		text-align: center;
		font-size: 2vh;
		padding: 1vh;
	}

	.person-detail-subsection-container {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
	}

	.person-detail-subsection-content-container {
		display: flex;
		flex-grow: 1;
		background-color: gainsboro;
		padding: 1vh;
	}
</style>
