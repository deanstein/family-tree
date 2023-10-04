import { writable } from 'svelte/store';

const uiState = {
	unsavedChanges: false,
	cachedPersonForUnsavedChanges: undefined,
	saveToRepoStatus: undefined,
	activeFamilyTreeDataId: {},
	activePerson: {},
	personIdForNodeEdit: undefined,
	personIdForNodeSettingsFlyout: undefined,
	personNodePositions: [],
	personNodeConnectionLineCanvas: undefined,
	personNodeConnectionLineCanvasHover: undefined,
	timelineCompositeScrollPos: { x: 0, y: 0 },
	timelineForceRelativeSpacing: false,
	timelineSpineCanvas: undefined,
	timelineFirstEventPosition: { x: 0, y: 0 },
	timelineLatestEventPosition: { x: 0, y: 0 },
	showChooseTreeModal: true,
	showPersonDetailView: false,
	showDevTools: false,
	showStoreView: false
};

export default writable(uiState);
