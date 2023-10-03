import { quintOut } from 'svelte/easing';
import { crossfade } from 'svelte/transition';

import {
	addOrUpdatePersonNodePosition,
	clearCanvas,
	getScreenCentroid,
	resetCanvasSize
} from '../logic/ui-management';
import stylingConstants from './styling-constants';

export const drawLineBetweenPoints = (context2d, startPosition, endPosition, thickness, color) => {
	if (!context2d || !startPosition || !endPosition || !color) {
		return;
	}

	// Draw lines from each node to the center of the canvas
	context2d.beginPath();
	context2d.moveTo(startPosition.x, startPosition.y);
	context2d.lineTo(endPosition.x, endPosition.y);
	context2d.lineWidth = thickness;
	context2d.strokeStyle = color; // color may include transparency (rgba)
	context2d.stroke();
};

export const drawNodeConnectionLines = (canvasRef, nodePositions, thickness, color) => {
	if (!canvasRef || !nodePositions) return; // Ensure canvasRef is available

	// node connection lines always go from the center of the screen to the position
	const startPosition = { x: getScreenCentroid().x, y: getScreenCentroid().y };
	const ctx = canvasRef.getContext('2d');

	// context needs to be adjusted for the device's pixel ratio
	resetCanvasSize(canvasRef);

	for (const endPosition of nodePositions) {
		drawLineBetweenPoints(ctx, startPosition, endPosition, thickness, color);
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

export const drawTimelineSpine = (
	spineCanvasRef,
	birthEventNodePosition,
	deathEventNodePosition
) => {
	if (spineCanvasRef && birthEventNodePosition && deathEventNodePosition) {
		if (!(spineCanvasRef instanceof HTMLCanvasElement)) {
			return;
		}
		clearCanvas(spineCanvasRef);
		// trim the canvas so it doesn't bleed past the parent borders
		const spineCanvasParent = spineCanvasRef?.parentNode;
		const spineCanvasParentRect = spineCanvasParent.getBoundingClientRect();
		const spineCanvasRefContext2d = spineCanvasRef.getContext('2d');
		spineCanvasRefContext2d.beginPath();
		spineCanvasRefContext2d.rect(
			spineCanvasParentRect.left,
			spineCanvasParentRect.top,
			spineCanvasParentRect.width,
			spineCanvasParentRect.height
		);
		spineCanvasRefContext2d.clip();

		drawLineBetweenPoints(
			spineCanvasRefContext2d,
			birthEventNodePosition,
			deathEventNodePosition,
			stylingConstants.sizes.nTimelineSpineCanvasLineThickness,
			stylingConstants.colors.timelineSpineColor
		);
	}
};
