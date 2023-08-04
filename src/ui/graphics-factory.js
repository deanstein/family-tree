export const drawLinesForAllNodes = (canvasRef, nodePositions) => {
	if (!canvasRef || !nodePositions) return; // Ensure canvasRef is available

	const ctx = canvasRef.getContext('2d');

	// context needs to be adjusted for the device's pixel ratio
	const pixelRatio = window.devicePixelRatio || 1;
	canvasRef.width = window.innerWidth * pixelRatio;
	canvasRef.height = window.innerHeight * pixelRatio;
	ctx.scale(pixelRatio, pixelRatio);

	for (const position of nodePositions) {
		drawLineFromPosToScreenCenter(ctx, position);
	}
};

export const drawLineFromPosToScreenCenter = (context2d, position) => {
	if (!position) {
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
	context2d.lineWidth = 5;
	context2d.strokeStyle = 'black';
	context2d.stroke();

	console.log('drawing line!');
};
