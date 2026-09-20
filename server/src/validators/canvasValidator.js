const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const positive = (value) => finite(value) && value > 0;

export function validateCanvasPayload(payload) {
  const errors = [];
  if (!payload || typeof payload !== 'object') return ['Request body must be a JSON object'];
  if (typeof payload.name !== 'string' || !payload.name.trim() || payload.name.trim().length > 100) errors.push('Name is required and must be at most 100 characters');
  if (!positive(payload.width) || payload.width > 5000) errors.push('Width must be between 1 and 5000');
  if (!positive(payload.height) || payload.height > 5000) errors.push('Height must be between 1 and 5000');
  if (!Array.isArray(payload.elements)) errors.push('Elements must be an array');
  else payload.elements.forEach((element, index) => {
    const label = `Element ${index + 1}`;
    if (!element || typeof element !== 'object') return errors.push(`${label} is malformed`);
    if (typeof element.id !== 'string' || !element.id.trim()) errors.push(`${label} requires an id`);
    if (!['rectangle', 'circle', 'text'].includes(element.type)) errors.push(`${label} has an invalid type`);
    if (!finite(element.x) || !finite(element.y)) errors.push(`${label} requires numeric x and y`);
    if (!finite(element.rotation ?? 0)) errors.push(`${label} has an invalid rotation`);
    if (typeof element.fill !== 'string' || !element.fill.trim() || element.fill.length > 32) errors.push(`${label} requires a valid fill`);
    if (element.type === 'circle') { if (!positive(element.radius)) errors.push(`${label} requires a positive radius`); }
    else {
      if (!positive(element.width) || !positive(element.height)) errors.push(`${label} requires positive width and height`);
      if (element.type === 'text') {
        if (typeof element.text !== 'string' || element.text.length > 2000) errors.push(`${label} requires valid text`);
        if (!positive(element.fontSize ?? 16)) errors.push(`${label} requires a positive fontSize`);
      }
    }
  });
  return errors;
}
