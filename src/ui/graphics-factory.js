import stylingConstants from './styling-constants';

export const drawAllNodeConnectionLines = (canvasRef, nodePositions) => {
	if (!canvasRef || !nodePositions) return; // Ensure canvasRef is available

	const ctx = canvasRef.getContext('2d');
	const color = stylingConstants.colors.personNodeConnectionLineColor;
	const thickness = stylingConstants.sizes.nPersonNodeConnectionLineThickness;

	// context needs to be adjusted for the device's pixel ratio
	const pixelRatio = window.devicePixelRatio || 1;
	canvasRef.width = window.innerWidth * pixelRatio;
	canvasRef.height = window.innerHeight * pixelRatio;
	ctx.scale(pixelRatio, pixelRatio);

	for (const position of nodePositions) {
		drawNodeConnectionLine(ctx, position, thickness, color);
	}
};

export const drawNodeConnectionLine = (context2d, position, thickness, color) => {
	if (!context2d || !position || !color) {
		return;
	}

	// Get the center of the screen
	const screenCenter = {
		x: window.innerWidth / 2,
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
