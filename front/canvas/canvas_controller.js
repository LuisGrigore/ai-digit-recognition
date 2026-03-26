export class CanvasController {
	constructor(canvas_view) {
		this.canvas_view = canvas_view;
		this._hasDrawing = false;
	}

	startDrawing(e) {
		this.canvas_view.startDrawing(e);
	}

	draw(e) {
		this.canvas_view.draw(e);
		this._hasDrawing = true;
	}

	stopDrawing() {
		this.canvas_view.stopDrawing();
	}

	reset() {
		this.canvas_view.reset();
		this._hasDrawing = false;
	}

	touchStart(e) {
		this.canvas_view.touchStart(e);
	}

	touchMove(e) {
		this.canvas_view.touchMove(e);
		this._hasDrawing = true;
	}

	/** Returns true if the user has drawn something since the last reset. */
	hasDrawing() {
		return this._hasDrawing;
	}
}