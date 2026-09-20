import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCanvasPayload } from '../src/validators/canvasValidator.js';

const valid = { name: 'Test', width: 900, height: 600, elements: [{ id: 'r1', type: 'rectangle', x: 10, y: 20, width: 100, height: 80, rotation: 0, fill: '#112233' }] };
test('accepts a valid canvas payload', () => assert.deepEqual(validateCanvasPayload(valid), []));
test('rejects malformed canvas and element dimensions', () => { const result = validateCanvasPayload({ ...valid, name: '', width: -1, elements: [{ ...valid.elements[0], type: 'image', width: 0 }] }); assert.ok(result.length >= 3); });
test('requires a positive circle radius', () => { const result = validateCanvasPayload({ ...valid, elements: [{ id: 'c', type: 'circle', x: 1, y: 1, radius: 0, rotation: 0, fill: '#fff' }] }); assert.ok(result.some((error) => error.includes('radius'))); });
