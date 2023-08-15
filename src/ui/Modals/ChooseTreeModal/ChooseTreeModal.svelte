<script>
	import { css } from '@emotion/css';

	import uiState from '../../../stores/ui-state';
	import stylingConstants from '../../styling-constants';

	import { chooseTreeStrings } from '../../strings';

	import ChooseTreeOption from './ChooseTreeOption.svelte';

	import { getRepoFamilyTreeAndSetActive, hideChooseTreeModal } from '../../../logic/ui-management';
	import Modal from '../Modal.svelte';

	const chooseTreeModalGridDynamicClass = css`
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

	const newFamilyTreeButtonOnClick = () => {
		// new family tree is already loaded, so just dismiss the choose tree modal
		hideChooseTreeModal();
	};

	const exampleFamilyTreeButtonOnClick = () => {
		// hide the modal
		hideChooseTreeModal();
		// load the Roy family tree
		getRepoFamilyTreeAndSetActive('0', '8890');
	};

	const loadFamilyTreeButtonOnClick = () => {
		// hide the modal
		hideChooseTreeModal();
		// load the family tree
		// TODO: add ability to choose, rather than hard-code
		getRepoFamilyTreeAndSetActive('1', '8890');
	};
</script>

<Modal
	showModal={$uiState.showChooseTreeModal}
	title={'Welcome!'}
	subtitle={'Choose a family tree:'}
	width={'50vw'}
	height={'50vh'}
	zIndex={stylingConstants.zIndices.personDetailViewZIndex}
>
	<div class="choose-tree-modal-content" slot="modal-content-slot">
		<div
			id="choose-tree-options-grid"
			class="{chooseTreeModalGridDynamicClass} choose-tree-options-grid"
		>
			<ChooseTreeOption
				buttonText={chooseTreeStrings.newTreeButton}
				buttonFunction={newFamilyTreeButtonOnClick}
				description={chooseTreeStrings.newTreeDescription}
			/>
			<ChooseTreeOption
				buttonText={chooseTreeStrings.exampleTreeButton}
				buttonFunction={exampleFamilyTreeButtonOnClick}
				description={chooseTreeStrings.exampleTreeDescription}
			/>
			<ChooseTreeOption
				buttonText={chooseTreeStrings.loadTreeButton}
				buttonFunction={loadFamilyTreeButtonOnClick}
				description={chooseTreeStrings.loadTreeDescription}
			/>
		</div>
		<div id="dev-message" class="choose-tree-dev-message">
			Note: This app is unfinished and may be both ugly and buggy.
		</div>
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
		padding: 10px;
		font-size: 1.5vh;
		font-style: italic;
		justify-content: center;
		text-align: center;
		color: #ebf596;
	}
</style>
