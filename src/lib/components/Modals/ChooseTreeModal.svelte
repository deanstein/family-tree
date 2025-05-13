<script>
	import { css } from '@emotion/css';

	import { isTreeEditActive } from '$lib/states/temp-state';
	import {
		doShowChooseTreeModal,
		saveToRepoStatus
	} from '$lib/states/ui-state';

	import {
		fetchExampleFamilyTreeAndSetActive
	} from '$lib/persistence-management';

	import { chooseTreeStrings, repoStateStrings } from '$lib/components/strings';
	import ChooseTreeOption from '$lib/components/Modals/ChooseTreeOption.svelte';
	import Modal from '$lib/components/Modals/Modal.svelte';
	import LoadFamilyTreeForm from './LoadFamilyTreeForm.svelte';
	import stylingConstants from '$lib/components/styling-constants';

	const chooseTreeModalGridCss = css`
		@media (max-width: ${stylingConstants.breakpoints.width[0]}) {
			flex-direction: column;
			gap: 2vh;
		}
		@media (min-width: ${stylingConstants.breakpoints.width[0]}) and (max-height: ${stylingConstants
				.breakpoints.width[1]}) {
			flex-direction: column;
			gap: 2vh;
		}
		@media (min-width: ${stylingConstants.breakpoints.width[1]}) {
			flex-direction: row;
			gap: 1vw;
		}
	`;

	const onClickNewTreeButton = () => {
		// new family tree is already loaded, so just dismiss the choose tree modal
		doShowChooseTreeModal.set(false);
	};

	const onClickExampleTreeButton = async () => {
		// set the loading notification
		saveToRepoStatus.set(repoStateStrings.loading);
		// hide the modal
		doShowChooseTreeModal.set(false);
		// set edit mode to off
		isTreeEditActive.set(false);
		// load the example family tree and set it active
		fetchExampleFamilyTreeAndSetActive();
	};
</script>

<Modal
	showModal={$doShowChooseTreeModal}
	title={'Welcome!'}
	subtitle={'Choose a family tree:'}
	width={'50vw'}
	height={'55vh'}
	overflow={'auto'}
	zIndex={stylingConstants.zIndices.personDetailViewZIndex}
>
	<div class="choose-tree-modal-content" slot="modal-content-slot">
		<div class="choose-tree-options-grid {chooseTreeModalGridCss}">
			<ChooseTreeOption
				faIcon={'fa-square-plus'}
				buttonText={chooseTreeStrings.newTreeButton}
				buttonFunction={onClickNewTreeButton}
				buttonColor={stylingConstants.colors.personNodeGradient1}
				description={chooseTreeStrings.newTreeDescription}
			/>
			<ChooseTreeOption
				faIcon={'fa-box-open'}
				buttonText={chooseTreeStrings.exampleTreeButton}
				buttonFunction={onClickExampleTreeButton}
				buttonColor={stylingConstants.colors.activePersonNodeColor}
				description={chooseTreeStrings.exampleTreeDescription}
			/>
			<ChooseTreeOption
				description={chooseTreeStrings.loadTreeDescription}
				buttonColor={stylingConstants.colors.personNodeGradient3}
			>
				<LoadFamilyTreeForm />
			</ChooseTreeOption>
		</div>
		<div class="choose-tree-dev-message">This app is in development and may be buggy.</div>
	</div>
</Modal>

<style>
	.choose-tree-modal-content {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		height: 100%;
		width: 100%;
		overflow: auto;
	}

	.choose-tree-options-grid {
		display: flex;
		flex-grow: 1;
	}

	.choose-tree-dev-message {
		display: flex;
		padding: 10px 10px 0px 10px;
		font-size: 1.5vh;
		font-style: italic;
		justify-content: center;
		text-align: center;
		color: #ebf596;
	}
</style>
