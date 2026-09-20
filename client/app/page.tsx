'use client';
import dynamic from 'next/dynamic';
const Editor = dynamic(() => import('../components/Editor'), { ssr: false, loading: () => <main className="boot">Opening Studio Canvas…</main> });
export default function Page() { return <Editor />; }
