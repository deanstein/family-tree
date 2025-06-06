<script>
	import { get } from 'svelte/store';
	import { css } from '@emotion/css';

	import { persistenceStatus } from '$lib/states/family-tree-state';
	import { isTreeEditActive } from '$lib/states/temp-state';
	import { showChooseTreeModal, showChooseTreeModalCloseButton } from '$lib/states/ui-state';

	import {
		fetchExampleFamilyTreeAndSetActive,
		fetchPrivateFamilyTreeAndSetActive
	} from '$lib/persistence-management';
	import { instantiateNewFamilyTreeAndSetActive } from '$lib/tree-management';

	import { chooseTreeStrings, persistenceStrings } from '$lib/components/strings';
	import AuthenticateTreeForm from './AuthenticateTreeForm.svelte';
	import ChooseTreeOption from '$lib/components/Modals/ChooseTreeOption.svelte';
	import Modal from '$lib/components/Modals/Modal.svelte';
	import stylingConstants from '$lib/components/styling-constants';

	// bind variables to the form component
	let firstName = '';
	let lastName = '';
	let birthdate = '';
	let showErrorMessage = false;
	let showLoadingMessage = false;

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
		// instantiate a new family tree
		instantiateNewFamilyTreeAndSetActive();
		// new family tree is already loaded, so just dismiss the choose tree modal
		showChooseTreeModal.set(false);
		// clear any error messaging if there is any
		persistenceStatus.set(undefined);
	};

	const onClickExampleTreeButton = async () => {
		// set the loading notification
		persistenceStatus.set(persistenceStrings.loading);
		// hide the modal
		showChooseTreeModal.set(false);
		// load the example family tree and set it active
		const exampleFamilyTreeData = await fetchExampleFamilyTreeAndSetActive();
		if (exampleFamilyTreeData) {
			// set edit mode to off
			isTreeEditActive.set(false);
		} else {
			persistenceStatus.set(persistenceStrings.loadFailed);
			showChooseTreeModal.set(true);
		}
	};

	const onClickLoadTreeButton = async () => {
		// hide any errors from last attempt
		showErrorMessage = false;
		persistenceStatus.set(undefined);
		// show that credentials are being checked
		showLoadingMessage = true;
		// attempt to get the private family tree
		const privateFamilyTreeData = await fetchPrivateFamilyTreeAndSetActive(
			firstName,
			lastName,
			birthdate
		);
		// set the loading notification
		persistenceStatus.set(persistenceStrings.loading);

		if (privateFamilyTreeData) {
			// hide the modal
			showChooseTreeModal.set(false);
			// set edit mode to off
			isTreeEditActive.set(false);
			showErrorMessage = false;
			showLoadingMessage = false;
		} else {
			showErrorMessage = true;
			showLoadingMessage = false;
			persistenceStatus.set(persistenceStrings.loadFailed);
		}
	};

	export const onClickCloseButton = () => {
		showChooseTreeModal.set(false);
	};
</script>

<Modal
	showModal={$showChooseTreeModal}
	onClickCloseButton={get(showChooseTreeModalCloseButton) ? onClickCloseButton : undefined}
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
				<AuthenticateTreeForm
					onClickButtonFunction={onClickLoadTreeButton}
					buttonText="Load Family Tree"
					buttonFaIcon="fa-people-roof"
					{showLoadingMessage}
					{showErrorMessage}
				/>
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
