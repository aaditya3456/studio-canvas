import { Router } from 'express';
import { createCanvas, deleteCanvas, getCanvas, listCanvases, updateCanvas } from '../controllers/canvasController.js';
import { asyncHandler } from '../utils/asyncHandler.js';
export const canvasRouter = Router();
canvasRouter.route('/').post(asyncHandler(createCanvas)).get(asyncHandler(listCanvases));
canvasRouter.route('/:id').get(asyncHandler(getCanvas)).put(asyncHandler(updateCanvas)).delete(asyncHandler(deleteCanvas));
