export class CanvasView {
	constructor({ canvas, ctx }) {
		this.canvas = canvas;
		this.ctx = ctx;

		this._setCanvasSize();

		this.isDrawing = false;
		this.lastX = 0;
		this.lastY = 0;

		this.ctx.strokeStyle = '#000';
		this.ctx.lineWidth = 30;
		this.ctx.lineJoin = 'round';
		this.ctx.lineCap = 'round';

		// Keep canvas dimensions in sync when the browser window is resized.
		window.addEventListener('resize', () => this._setCanvasSize());
	}

	_setCanvasSize() {
		this.canvas.width = this.canvas.offsetWidth;
		this.canvas.height = this.canvas.offsetHeight;
		// Re-apply stroke settings because resizing the canvas resets the context.
		this.ctx.strokeStyle = '#000';
		this.ctx.lineWidth = 30;
		this.ctx.lineJoin = 'round';
		this.ctx.lineCap = 'round';
	}

	startDrawing(e) {
		this.isDrawing = true;
		[this.lastX, this.lastY] = [e.offsetX, e.offsetY];
	}

	draw(e) {
		if (!this.isDrawing) return;
		this.ctx.beginPath();
		this.ctx.moveTo(this.lastX, this.lastY);
		this.ctx.lineTo(e.offsetX, e.offsetY);
		this.ctx.stroke();
		[this.lastX, this.lastY] = [e.offsetX, e.offsetY];
	}

	stopDrawing() {
		this.isDrawing = false;
	}

	touchStart(e) {
		const touch = e.touches[0];
		const rect = this.canvas.getBoundingClientRect();
		this.lastX = touch.clientX - rect.left;
		this.lastY = touch.clientY - rect.top;
		this.isDrawing = true;
	}

	touchMove(e) {
		// Prevent the page from scrolling while the user draws on the canvas.
		e.preventDefault();
		if (!this.isDrawing) return;
		const touch = e.touches[0];
		const rect = this.canvas.getBoundingClientRect();
		const x = touch.clientX - rect.left;
		const y = touch.clientY - rect.top;
		this.ctx.beginPath();
		this.ctx.moveTo(this.lastX, this.lastY);
		this.ctx.lineTo(x, y);
		this.ctx.stroke();
		this.lastX = x;
		this.lastY = y;
	}

	reset() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}