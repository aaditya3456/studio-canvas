export type ElementType = 'rectangle' | 'circle' | 'text';
export type CanvasElement = { id: string; type: ElementType; x: number; y: number; rotation: number; fill: string; width?: number; height?: number; radius?: number; text?: string; fontSize?: number };
export type DesignCanvas = { _id: string; name: string; width: number; height: number; elements: CanvasElement[]; createdAt: string; updatedAt: string };
export type CanvasPayload = Pick<DesignCanvas, 'name' | 'width' | 'height' | 'elements'>;
