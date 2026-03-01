"use client";
import React from 'react';
import { AIChatBar } from '../../sidebar/AIChatBar';

export function AITab() {
    return (
        <div className="flex flex-col">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">AI Assistant</p>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Describe changes and the AI will update your site. Select a section to scope changes to it.
            </p>
            <AIChatBar />
        </div>
    );
}
