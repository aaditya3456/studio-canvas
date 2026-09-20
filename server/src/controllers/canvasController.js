import mongoose from 'mongoose';
import { Canvas } from '../models/Canvas.js';
import { validateCanvasPayload } from '../validators/canvasValidator.js';

const assertId = (id) => { if (!mongoose.isValidObjectId(id)) { const error = new Error('Invalid canvas id'); error.status = 400; throw error; } };
const payload = (body) => ({ ...body, name: body.name?.trim() });
export async function createCanvas(req, res) { const errors = validateCanvasPayload(req.body); if (errors.length) return res.status(400).json({ success: false, message: 'Invalid canvas data', errors }); const canvas = await Canvas.create(payload(req.body)); res.status(201).json({ success: true, data: canvas }); }
export async function listCanvases(_req, res) { const canvases = await Canvas.find().select('name width height elements createdAt updatedAt').sort({ updatedAt: -1 }).lean(); res.json({ success: true, data: canvases.map(({ elements, ...canvas }) => ({ ...canvas, elementCount: elements.length })) }); }
export async function getCanvas(req, res) { assertId(req.params.id); const canvas = await Canvas.findById(req.params.id).lean(); if (!canvas) return res.status(404).json({ success: false, message: 'Canvas not found' }); res.json({ success: true, data: canvas }); }
export async function updateCanvas(req, res) { assertId(req.params.id); const errors = validateCanvasPayload(req.body); if (errors.length) return res.status(400).json({ success: false, message: 'Invalid canvas data', errors }); const canvas = await Canvas.findByIdAndUpdate(req.params.id, payload(req.body), { new: true, runValidators: true }).lean(); if (!canvas) return res.status(404).json({ success: false, message: 'Canvas not found' }); res.json({ success: true, data: canvas }); }
export async function deleteCanvas(req, res) { assertId(req.params.id); const canvas = await Canvas.findByIdAndDelete(req.params.id).lean(); if (!canvas) return res.status(404).json({ success: false, message: 'Canvas not found' }); res.json({ success: true, message: 'Canvas deleted' }); }
