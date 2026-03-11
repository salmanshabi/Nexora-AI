import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Loader2 } from 'lucide-react';
import { useEditorStore } from '@/lib/editor/store';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hi! I'm the Nexora AI Assistant. How can I help you build your website today?\n\nTry:\n- \"Create a dark mode hero section\"\n- \"Change the styling to modern\"\n- \"Change the text to green\"" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  
  const { blocks, addBlock, updateGlobalStyles, updateBlockStyles } = useEditorStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/editor/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMessage,
          currentState: blocks,
        })
      });

      if (!res.ok) throw new Error("Failed to fetch from AI");

      const data = await res.json();
      
      // Apply mutations safely
      if (data.mutations && Array.isArray(data.mutations)) {
        data.mutations.forEach((mut: { action: string; blockType?: "section" | "hero" | "features" | "pricing" | "testimonials" | "navbar" | "grid" | "container" | "text" | "image" | "button"; parentId?: string; styles?: Record<string, unknown>; id?: string }) => {
          if (mut.action === 'addBlock' && mut.blockType && mut.parentId) {
            addBlock(mut.blockType, mut.parentId);
          } else if (mut.action === 'updateGlobalStyles' && mut.styles) {
            updateGlobalStyles(mut.styles);
          } else if (mut.action === 'updateBlockStyles' && mut.id && mut.styles) {
            updateBlockStyles(mut.id, mut.styles);
          }
        });
      }

      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.message || "I've applied the requested changes to your design." 
      }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error while processing your request." }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="absolute bottom-6 left-6 2xl:left-[300px] bg-indigo-600 hover:bg-indigo-500 text-white rounded-full p-3 shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center justify-center group z-50"
        title="AI Assistant"
      >
        <Sparkles size={24} className="group-hover:animate-pulse" />
      </button>
    );
  }

  return (
    <div className="absolute bottom-6 left-6 2xl:left-[300px] w-[350px] bg-[#18181B] border border-[#3f3f46] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 z-50">
      <div className="flex items-center justify-between p-3 border-b border-[#3f3f46] bg-gradient-to-r from-indigo-900/40 to-transparent">
        <div className="flex items-center space-x-2">
          <div className="bg-indigo-500/20 p-1.5 rounded-lg text-indigo-400">
            <Sparkles size={16} />
          </div>
          <span className="font-medium text-sm text-gray-200">Nexora Assistant</span>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-[#3f3f46] transition-colors"
        >
          <X size={16} />
        </button>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex-1 h-[350px] overflow-y-auto p-4 flex flex-col space-y-4 text-sm bg-[#121214] custom-scrollbar"
      >
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={`max-w-[85%] rounded-lg p-3 ${
              m.role === 'assistant' 
                ? 'bg-[#2C2C30] text-gray-300 rounded-tl-sm self-start shadow-sm border border-[#3f3f46]' 
                : 'bg-indigo-600 text-white rounded-tr-sm self-end shadow-md'
            }`}
          >
            <div className="whitespace-pre-line">{m.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="bg-[#2C2C30] text-gray-400 p-3 rounded-lg rounded-tl-sm self-start w-16 flex justify-center border border-[#3f3f46]">
            <Loader2 size={16} className="animate-spin text-indigo-400" />
          </div>
        )}
      </div>

      <div className="p-3 border-t border-[#3f3f46] bg-[#18181B]">
        <form className="relative flex items-center" onSubmit={handleSubmit}>
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Ask AI to modify design..." 
            className="w-full bg-[#09090B] border border-[#3f3f46] rounded-lg px-3 py-2.5 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner disabled:opacity-50"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-1.5 text-indigo-400 hover:text-indigo-300 disabled:opacity-50 disabled:hover:text-indigo-400 p-1.5 rounded-md transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
