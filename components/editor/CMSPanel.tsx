import React from 'react';
import { Database, Plus, Settings } from 'lucide-react';

export function CMSPanel() {
  const collections = [
    { name: 'Blog Posts', count: 12 },
    { name: 'Authors', count: 3 },
    { name: 'Projects', count: 8 },
  ];

  return (
    <div className="text-sm pb-10">
      <div className="flex items-center justify-between mb-3 px-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">CMS Collections</h3>
        <button className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-[#2C2C30] transition-colors">
          <Plus size={14} />
        </button>
      </div>
      
      <div className="space-y-2 px-2">
        {collections.map((collection) => (
          <div 
            key={collection.name}
            className="flex items-center justify-between p-3 rounded-md border border-[#2C2C30] bg-[#121214] hover:border-[#3f3f46] transition-colors cursor-pointer group"
          >
            <div className="flex items-center text-gray-300 group-hover:text-white">
              <Database size={14} className="mr-3 text-indigo-400" />
              <span>{collection.name}</span>
            </div>
            <span className="text-xs text-gray-500 bg-[#2C2C30] px-2 py-0.5 rounded-full">
              {collection.count}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 px-2">
         <button className="w-full flex items-center justify-center p-2 rounded-md border border-dashed border-[#3f3f46] text-gray-400 hover:text-white hover:border-gray-500 transition-colors text-xs">
           <Settings size={14} className="mr-2" />
           Manage Database
         </button>
      </div>
    </div>
  );
}
