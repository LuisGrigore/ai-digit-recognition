import { CanvasController } from "./canvas/canvas_controller.js";
import { CanvasView } from "./canvas/canvas_view.js";
import Client from "./client.js";
import { ResultController } from "./result/result_controller.js";
import { ResultView } from "./result/result_view.js";

const canvas = document.getElementById('drawingCanvas');
const submitButton = document.getElementById('submitButton');
const resetButton = document.getElementById('resetButton');
const resultText = document.getElementById('resultText');
const ctx = canvas.getContext('2d');


const canvas_view = new CanvasView({canvas: canvas, ctx: ctx})
const canvas_controller = new CanvasController(canvas_view)

const result_view = new ResultView({res_text: resultText})
const client = new Client();
const result_controller = new ResultController({result_view: result_view, http_client: client})

canvas.addEventListener('mousedown', (e) =>{
	canvas_controller.startDrawing(e)
})
canvas.addEventListener('mousemove',(e) =>{
	 canvas_controller.draw(e)
})
canvas.addEventListener('mouseup', () =>{
	canvas_controller.stopDrawing()
})
canvas.addEventListener('mouseout', () =>{
	canvas_controller.stopDrawing()
})

canvas.addEventListener('touchstart', (e) => {
	canvas_controller.touchStart(e)
})
canvas.addEventListener('touchmove', (e) => {
    canvas_controller.touchMove(e)
})

canvas.addEventListener('touchend', () =>{
	canvas_controller.stopDrawing()
})
canvas.addEventListener('touchcancel', () =>{
	canvas_controller.stopDrawing()
})


// submitButton.addEventListener('click', (e) =>{
// 	e.preventDefault();
// 	const dataURL = canvas.toDataURL('image/png');
// 	fetch(dataURL).then((result) => {
// 		result.blob().then((image) => {
// 			result_controller.sendImage(image)
// 		})
// 	})
// })

submitButton.addEventListener('click', (e) => {
	e.preventDefault();
	canvas.toBlob((image) => {
		result_controller.sendImage(image);
	}, 'image/png');
});

resetButton.addEventListener('click', () =>{
	canvas_controller.reset()
})




