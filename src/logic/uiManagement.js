import uiState from "../stores/uiState";

export const setActiveNodeEditId = (sPersonId) => {
    uiState.update((currentValue) => {
        currentValue.sPersonIdForNodeEdit = sPersonId;
        return currentValue;
    });
};

export const unsetActiveNodeEditId = () => {
    uiState.update((currentValue) => {
        currentValue.sPersonIdForNodeEdit = undefined;
        return currentValue;
    });
};