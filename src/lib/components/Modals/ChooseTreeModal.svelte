<script>
	import { css } from '@emotion/css';

	import { isTreeEditActive } from '$lib/states/temp-state';
	import { doShowChooseTreeModal } from '$lib/states/ui-state';

	import { getRepoFamilyTreeAndSetActive } from '$lib/ui-management';

	import { chooseTreeStrings } from '$lib/components/strings';
	import stylingConstants from '$lib/components/styling-constants';

	import ChooseTreeOption from '$lib/components/Modals/ChooseTreeOption.svelte';
	import Modal from '$lib/components/Modals/Modal.svelte';
	import { verifyFamilyTreeMember } from '$lib/persistence-management';

	// user values
	let id = '';
	let name = '';
	let birthdate = '';

	async function submit() {
		// encode the name and birthdate
		const encodedName = encodeURIComponent(name);
		const encodedBirthdate = encodeURIComponent(birthdate);
		const verifiedId = await verifyFamilyTreeMember(
			id || null,
			encodedName || null,
			encodedBirthdate || null
		);
		if (verifiedId) {
			console.log('Verified! Active user ID:', verifiedId);
		} else {
			console.log('Verification failed.');
		}
	}

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

	const newFamilyTreeButtonOnClick = () => {
		// new family tree is already loaded, so just dismiss the choose tree modal
		doShowChooseTreeModal.set(false);
	};

	const exampleFamilyTreeButtonOnClick = () => {
		// hide the modal
		doShowChooseTreeModal.set(false);
		// set edit mode to off
		isTreeEditActive.set(false);
		// load the Roy family tree
		getRepoFamilyTreeAndSetActive('0');
	};

	const loadFamilyTreeButtonOnClick = () => {
		// hide the modal
		doShowChooseTreeModal.set(false);
		// set edit mode to off
		isTreeEditActive.set(false);
		// load the private family tree
		getRepoFamilyTreeAndSetActive('1');
	};
</script>

<Modal
	showModal={$doShowChooseTreeModal}
	title={'Welcome!'}
	subtitle={'Choose a family tree:'}
	width={'50vw'}
	height={'50vh'}
	overflow={'auto'}
	zIndex={stylingConstants.zIndices.personDetailViewZIndex}
>
	<div class="choose-tree-modal-content" slot="modal-content-slot">
		<div class="choose-tree-options-grid {chooseTreeModalGridCss}">
			<ChooseTreeOption
				faIcon={'fa-square-plus'}
				buttonText={chooseTreeStrings.newTreeButton}
				buttonFunction={newFamilyTreeButtonOnClick}
				buttonColor={stylingConstants.colors.personNodeGradient1}
				description={chooseTreeStrings.newTreeDescription}
			/>
			<ChooseTreeOption
				faIcon={'fa-box-open'}
				buttonText={chooseTreeStrings.exampleTreeButton}
				buttonFunction={exampleFamilyTreeButtonOnClick}
				buttonColor={stylingConstants.colors.activePersonNodeColor}
				description={chooseTreeStrings.exampleTreeDescription}
			/>
			<ChooseTreeOption
				faIcon={'fa-people-roof'}
				buttonText={chooseTreeStrings.loadTreeButton}
				buttonFunction={loadFamilyTreeButtonOnClick}
				description={chooseTreeStrings.loadTreeDescription}
				buttonColor={stylingConstants.colors.personNodeGradient3}
			/>
			<form on:submit|preventDefault={submit}>
				<label for="id">GUID (optional)</label>
				<input type="text" id="id" bind:value={id} placeholder="Enter your ID" />

				<label for="name">Name</label>
				<input type="text" id="name" bind:value={name} placeholder="Enter your name" />

				<label for="birthdate">Birthdate</label>
				<input type="date" id="birthdate" bind:value={birthdate} />

				<button type="submit">Verify</button>
			</form>
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
