<script>
	import uiState from '../../../stores/ui-state';
	import stylingConstants from '../../styling-constants';
	import { hidePersonDetailView } from '../../../logic/ui-management';

	import Button from '../../Button.svelte';
	import Timeline from './Timeline/Timeline.svelte';
	import Bio from './Bio/Bio.svelte';
	import Modal from '../Modal.svelte';

	const closeButtonOnClick = () => {
		hidePersonDetailView();
	};
</script>

<Modal showModal={$uiState.showPersonDetailView} modalTitle={undefined} modalWidth={'80vw'} modalHeight={'80vh'} zIndex={stylingConstants.zIndices.personDetailViewZIndex}>
	<div class="person-detail-modal-content" slot="modal-content-slot">
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
</Modal>

<style>
	.person-detail-modal-content {
		display: flex;
		flex-direction: row;
		flex-grow: 1;
		height: 100%;
		width: 100%;
		gap: 1vw;
		padding: 1vw;;
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
</style>
