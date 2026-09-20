import mongoose from 'mongoose';

const elementSchema = new mongoose.Schema({
  id: { type: String, required: true, trim: true },
  type: { type: String, required: true, enum: ['rectangle', 'circle', 'text'] },
  x: { type: Number, required: true }, y: { type: Number, required: true },
  width: Number, height: Number, radius: Number,
  rotation: { type: Number, default: 0 },
  fill: { type: String, required: true, maxlength: 32 },
  text: { type: String, maxlength: 2000 }, fontSize: Number
}, { _id: false });

const canvasSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 1, maxlength: 100 },
  width: { type: Number, required: true, min: 1, max: 5000 },
  height: { type: Number, required: true, min: 1, max: 5000 },
  elements: { type: [elementSchema], default: [] }
}, { timestamps: true, versionKey: false });

export const Canvas = mongoose.model('Canvas', canvasSchema);
