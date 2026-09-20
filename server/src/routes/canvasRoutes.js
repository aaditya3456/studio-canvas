import { Router } from 'express';
import { createCanvas, deleteCanvas, getCanvas, listCanvases, updateCanvas } from '../controllers/canvasController.js';
export const canvasRouter = Router();
canvasRouter.route('/').post(createCanvas).get(listCanvases);
canvasRouter.route('/:id').get(getCanvas).put(updateCanvas).delete(deleteCanvas);
