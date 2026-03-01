import React from 'react';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

interface DeviceToggleProps {
    current: 'desktop' | 'tablet' | 'mobile';
    onChange: (device: 'desktop' | 'tablet' | 'mobile') => void;
}

export function DeviceToggle({ current, onChange }: DeviceToggleProps) {
    return (
        <div className="flex items-center gap-1 bg-gray-900 border border-gray-800 p-1 rounded-lg">
            <button
                onClick={(e) => { e.stopPropagation(); onChange('desktop'); }}
                className={`p-1.5 rounded-md transition-all ${current === 'desktop' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                title="Desktop View"
            >
                <Monitor size={16} />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); onChange('tablet'); }}
                className={`p-1.5 rounded-md transition-all ${current === 'tablet' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                title="Tablet View"
            >
                <Tablet size={16} />
            </button>
            <button
                onClick={(e) => { e.stopPropagation(); onChange('mobile'); }}
                className={`p-1.5 rounded-md transition-all ${current === 'mobile' ? 'bg-gray-700 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                title="Mobile View"
            >
                <Smartphone size={16} />
            </button>
        </div>
    );
}
