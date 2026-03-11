import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Visual Editor | Nexora AI',
  description: 'AI-powered visual website builder.',
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-screen bg-black overflow-hidden m-0 p-0 text-white font-sans selection:bg-blue-500/30">
      {children}
    </div>
  );
}
