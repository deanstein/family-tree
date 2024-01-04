import { quintOut } from 'svelte/easing';
import { crossfade } from 'svelte/transition';

import {
	addOrUpdatePersonNodePosition,
	getScreenCentroid,
	resetCanvasSize
} from '$lib/ui-management';

export const parseRgbaColorString = (rgbaColorString) => {
	const match = rgbaColorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)/i);
	if (match) {
		return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3]), parseFloat(match[4] || 1)];
	}
	return null;
};

export const generateGradient = (steps, colorString1, colorString2, colorString3) => {
	const startColor = parseRgbaColorString(colorString1);
	const midColor = parseRgbaColorString(colorString2);
	const endColor = colorString3 ? parseRgbaColorString(colorString3) : midColor;
	const colors = [];
	const halfSteps = Math.floor(steps / 2);

	for (let i = 0; i < halfSteps; i++) {
		const r = startColor[0] + ((midColor[0] - startColor[0]) / halfSteps) * i;
		const g = startColor[1] + ((midColor[1] - startColor[1]) / halfSteps) * i;
		const b = startColor[2] + ((midColor[2] - startColor[2]) / halfSteps) * i;
		const a = startColor[3] + ((midColor[3] - startColor[3]) / halfSteps) * i;
		colors.push(`rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a.toFixed(2)})`);
	}

	for (let i = halfSteps; i < steps; i++) {
		const r = midColor[0] + ((endColor[0] - midColor[0]) / halfSteps) * (i - halfSteps);
		const g = midColor[1] + ((endColor[1] - midColor[1]) / halfSteps) * (i - halfSteps);
		const b = midColor[2] + ((endColor[2] - midColor[2]) / halfSteps) * (i - halfSteps);
		const a = midColor[3] + ((endColor[3] - midColor[3]) / halfSteps) * (i - halfSteps);
		colors.push(`rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a.toFixed(2)})`);
	}

	return colors;
};

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

export const drawCrossfade = (duration) => {
	return crossfade({
		duration: duration ? duration : (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: duration,
				easing: quintOut,
				css: (t) => `
			transform: ${transform} scale(${t});
			opacity: ${t}
		  `
			};
		}
	});
};
