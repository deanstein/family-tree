<script>
	import uiState from '$lib/stores/ui-state';

	import { hidePersonDetailView } from '$lib/ui-management';

	import stylingConstants from '$lib/components/styling-constants';

	import Button from '$lib/components/Button.svelte';
	import Timeline from '$lib/components/Timeline/Timeline.svelte';
	import Bio from '$lib/components/Bio/Bio.svelte';
	import Modal from '$lib/components/Modals/Modal.svelte';

	const closeButtonOnClick = () => {
		hidePersonDetailView();
	};
</script>

<Modal
	showModal={$uiState.showPersonDetailView}
	title={'Person details'}
	subtitle={null}
	width={'80vw'}
	height={'80vh'}
	padding={'15px'}
	zIndex={stylingConstants.zIndices.personDetailViewZIndex}
>
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
	</div></Modal
>

<style>
	.person-detail-modal-content {
		display: flex;
		flex-direction: row;
		flex-grow: 1;
		height: 100%;
		width: 100%;
		gap: 1vw;
	}

	.person-detail-bio-container {
		display: flex;
		flex-direction: column;
		flex-basis: 33.333%;
		overflow-y: auto;
		border-radius: 10px;
	}

	.person-detail-timeline-container {
		display: flex;
		flex-direction: column;
		flex-basis: 67.667%;
	}

	.person-detail-timeline-content-container {
		display: flex;
		flex-grow: 1;
		height: -webkit-fill-available;
		width: -moz-available;
		background-color: gainsboro;
		padding: 1vh;
		border-radius: 10px;
	}
</style>
