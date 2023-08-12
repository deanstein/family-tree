import {
	addOrUpdatePersonNodePosition,
	getScreenCentroid,
	resetCanvasSize
} from '../logic/ui-management';

export const drawNodeConnectionLine = (context2d, position, thickness, color) => {
	if (!context2d || !position || !color) {
		return;
	}

	// Draw lines from each node to the center of the canvas
	context2d.beginPath();
	context2d.moveTo(getScreenCentroid().x, getScreenCentroid().y);
	context2d.lineTo(position.x, position.y);
	context2d.lineWidth = thickness;
	context2d.strokeStyle = color; // color may include transparency (rgba)
	context2d.stroke();
};

export const drawNodeConnectionLines = (canvasRef, nodePositions, thickness, color) => {
	if (!canvasRef || !nodePositions) return; // Ensure canvasRef is available

	console.log('called');
	const ctx = canvasRef.getContext('2d');

	// context needs to be adjusted for the device's pixel ratio
	resetCanvasSize(canvasRef);

	for (const position of nodePositions) {
		drawNodeConnectionLine(ctx, position, thickness, color);
	}
};

// forces the store to update by updating a particular personId
// this should be used only with the personId from uiState
export const redrawNodeConnectionLines = (personId) => {
	addOrUpdatePersonNodePosition(personId, getScreenCentroid());
};
