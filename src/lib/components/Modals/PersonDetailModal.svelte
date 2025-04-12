<script>
	import { css } from '@emotion/css';

	import uiState from '$lib/stores/ui-state';

	import { hidePersonDetailView } from '$lib/ui-management';

	import Bio from '$lib/components/Bio/Bio.svelte';
	import Modal from '$lib/components/Modals/Modal.svelte';
	import Timeline from '$lib/components/Timeline/Timeline.svelte';
	import stylingConstants from '$lib/components/styling-constants';

	const onClickCloseButton = () => {
		hidePersonDetailView();
	};

	const personDetailModalBioContainerCss = css`
		@media (max-width: ${stylingConstants.breakpoints.width[0]}) {
		}
		@media (min-width: ${stylingConstants.breakpoints.width[0]}) and (max-height: ${stylingConstants
				.breakpoints.width[1]}) {
		}
		@media (min-width: ${stylingConstants.breakpoints.width[1]}) {
			overflow-y: auto;
		}
	`;

	const personDetailModalContentCss = css`
		@media (max-width: ${stylingConstants.breakpoints.width[0]}) {
			flex-direction: column;
		}
		@media (min-width: ${stylingConstants.breakpoints.width[0]}) and (max-height: ${stylingConstants
				.breakpoints.width[1]}) {
			flex-direction: column;
		}
		@media (min-width: ${stylingConstants.breakpoints.width[1]}) {
			flex-direction: row;
		}
	`;
</script>

<Modal
	showModal={$uiState.showPersonDetailView}
	showCloseButton={true}
	{onClickCloseButton}
	title={'Person Details'}
	subtitle={null}
	width={'80vw'}
	height={'80vh'}
	padding={'15px'}
	zIndex={stylingConstants.zIndices.personDetailViewZIndex}
>
	<div class="person-detail-modal-content {personDetailModalContentCss}" slot="modal-content-slot">
		<div class="person-detail-bio-container {personDetailModalBioContainerCss}">
			<Bio />
		</div>
		<div class="person-detail-timeline-container">
			<div class="person-detail-timeline-content-container">
				<Timeline />
			</div>
		</div>
	</div>
</Modal>

<style>
	.person-detail-modal-content {
		display: flex;
		overflow: scroll;
		flex-grow: 1;
		height: 100%;
		width: 100%;
		gap: 1vw;
	}

	.person-detail-bio-container {
		display: flex;
		flex-direction: column;
		flex-basis: 33.333%;
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
