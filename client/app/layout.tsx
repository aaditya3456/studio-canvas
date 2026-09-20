import type { Metadata } from 'next'; import './globals.css';
export const metadata: Metadata = { title: 'Studio Canvas', description: 'A focused mini design editor' };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
