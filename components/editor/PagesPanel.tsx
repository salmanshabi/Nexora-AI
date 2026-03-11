import React from 'react';
import { FileText, Home, Info, Phone, Plus } from 'lucide-react';

export function PagesPanel() {
  const pages = [
    { name: 'Home', icon: Home, isActive: true },
    { name: 'About Us', icon: Info, isActive: false },
    { name: 'Services', icon: FileText, isActive: false },
    { name: 'Contact', icon: Phone, isActive: false },
  ];

  return (
    <div className="text-sm pb-10">
      <div className="flex items-center justify-between mb-3 px-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Pages</h3>
        <button className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-[#2C2C30] transition-colors">
          <Plus size={14} />
        </button>
      </div>
      
      <div className="space-y-1">
        {pages.map((page) => {
          const Icon = page.icon;
          return (
            <button 
              key={page.name}
              className={`w-full flex items-center px-3 py-2 rounded-md transition-colors ${
                page.isActive 
                  ? 'bg-blue-600/10 text-blue-500' 
                  : 'text-gray-300 hover:text-white hover:bg-[#2C2C30]'
              }`}
            >
              <Icon size={14} className="mr-3 opacity-70" />
              <span>{page.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
