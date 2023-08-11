import { set2DContextScale } from '../logic/ui-management';
import uiState from '../stores/ui-state';
import stylingConstants from './styling-constants';

export const drawAllNodeConnectionLines = (nodePositions) => {
	uiState.subscribe((currentValue) => {
		const canvasRef = currentValue.personNodeConnectionLineCanvas;

		if (!canvasRef || !nodePositions) return; // Ensure canvasRef is available

		const ctx = canvasRef.getContext('2d');

		// context needs to be adjusted for the device's pixel ratio
		set2DContextScale(canvasRef, ctx);

		for (const position of nodePositions) {
			drawNodeConnectionLine(
				ctx,
				position,
				stylingConstants.sizes.nPersonNodeConnectionLineThickness,
				stylingConstants.colors.personNodeConnectionLineColor
			);
		}
	});
};

export const drawNodeConnectionLine = (context2d, position, thickness, color) => {
	if (!context2d || !position || !color) {
		return;
	}

	// Get the center of the screen
	const screenCenter = {
		x: document.documentElement.clientWidth / 2,
		y: window.innerHeight / 2
	};

	// Draw lines from each node to the center of the canvas
	context2d.beginPath();
	context2d.moveTo(screenCenter.x, screenCenter.y);
	context2d.lineTo(position.x, position.y);
	context2d.lineWidth = thickness;
	context2d.strokeStyle = color; // color may include transparency (rgba)
	context2d.stroke();
};
