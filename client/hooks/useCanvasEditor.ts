import { useCallback, useEffect, useMemo, useState } from 'react'; import type { CanvasElement } from '../types/canvas';
const clone = (elements: CanvasElement[]) => structuredClone(elements);
export function useCanvasEditor() {
 const [elements, setElementsState] = useState<CanvasElement[]>([]); const [selectedId, setSelectedId] = useState<string | null>(null); const [past, setPast] = useState<CanvasElement[][]>([]); const [future, setFuture] = useState<CanvasElement[][]>([]);
 const commit = useCallback((next: CanvasElement[]) => { setElementsState((current) => { setPast((history) => [...history.slice(-49), clone(current)]); setFuture([]); return next; }); }, []);
 const update = useCallback((id: string, patch: Partial<CanvasElement>) => commit(elements.map((el) => el.id === id ? { ...el, ...patch } : el)), [elements, commit]);
 const add = useCallback((element: CanvasElement) => { commit([...elements, element]); setSelectedId(element.id); }, [elements, commit]);
 const remove = useCallback(() => { if (!selectedId) return; commit(elements.filter((el) => el.id !== selectedId)); setSelectedId(null); }, [selectedId, elements, commit]);
 const replace = useCallback((next: CanvasElement[]) => { setElementsState(clone(next)); setPast([]); setFuture([]); setSelectedId(null); }, []);
 const undo = useCallback(() => { if (!past.length) return; setElementsState((current) => { const previous = past[past.length - 1]; setFuture((items) => [clone(current), ...items]); return previous; }); setPast((items) => items.slice(0, -1)); }, [past]);
 const redo = useCallback(() => { if (!future.length) return; setElementsState((current) => { const next = future[0]; setPast((items) => [...items, clone(current)]); return next; }); setFuture((items) => items.slice(1)); }, [future]);
 useEffect(() => { const keydown = (event: KeyboardEvent) => { const target = event.target as HTMLElement; if (target.closest('input, textarea')) return; if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') { event.preventDefault(); event.shiftKey ? redo() : undo(); } else if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') { event.preventDefault(); redo(); } else if ((event.key === 'Delete' || event.key === 'Backspace') && selectedId) { event.preventDefault(); remove(); } }; window.addEventListener('keydown', keydown); return () => window.removeEventListener('keydown', keydown); }, [selectedId, remove, undo, redo]);
 return useMemo(() => ({ elements, selectedId, setSelectedId, add, update, remove, replace, undo, redo, canUndo: !!past.length, canRedo: !!future.length }), [elements, selectedId, add, update, remove, replace, undo, redo, past.length, future.length]);
}
