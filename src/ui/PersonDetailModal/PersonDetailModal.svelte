<script>
	import { css } from '@emotion/css';
	import Portal from 'svelte-portal';

	import uiState from '../../stores/ui-state';
	import stylingConstants from '../styling-constants';
	import { hidePersonDetailView } from '../../logic/ui-management';

	import Button from '../Button.svelte';
	import Overlay from '../NodeView/Overlay.svelte';
	import Timeline from './Timeline/Timeline.svelte';
	import Bio from './Bio/Bio.svelte';

	const personDetailContainerDynamicClass = css`
		z-index: ${stylingConstants.zIndices.personDetailViewZIndex};
	`;

	const closeButtonOnClick = () => {
		hidePersonDetailView();
	};
</script>

{#if $uiState.showPersonDetailView}
	<div id="person-detail-container" class="person-detail-container">
		<div
			id="person-detail-content-container"
			class="person-detail-content-container {personDetailContainerDynamicClass}"
		>
			<div id="person-detail-bio-container" class="person-detail-bio-container">
				<Bio />
			</div>
			<div id="person-detail-timeline-container" class="person-detail-timeline-container">
				<div
					id="person-detail-timeline-content-container"
					class="person-detail-timeline-content-container"
				>
					<Timeline />
				</div>
			</div>
			<div id="temp-close-button" class="temp-close-button">
				<Button buttonText={'X'} onClickFunction={closeButtonOnClick} />
			</div>
		</div>
		<Portal target="#app-container">
			<Overlay />
		</Portal>
	</div>
{/if}

<style>
	.person-detail-container {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
		width: 100vw;
	}

	.person-detail-content-container {
		position: relative;
		display: flex;
		flex-direction: row;
		width: 80vw;
		height: 80vh;
		gap: 1vw;
		padding: 1vw;
		background-color: rgba(255, 255, 255, 0.2);
	}

	.person-detail-bio-container {
		display: flex;
		flex-direction: column;
		flex-basis: 33.333%;
		overflow-y: auto;
	}

	.person-detail-timeline-container {
		display: flex;
		flex-direction: column;
		flex-basis: 67.667%;
	}

	.person-detail-timeline-content-container {
		display: flex;
		flex-grow: 1;
		background-color: gainsboro;
		padding: 1vh;
	}

	.temp-close-button {
		position: absolute;
		transform: translate(50%, -50%);
		top:  0px;
		right: 0px;
	}
</style>
