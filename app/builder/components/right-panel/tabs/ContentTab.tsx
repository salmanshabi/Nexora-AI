"use client";
import React from 'react';
import { useBuilderStore } from '../../../store/useBuilderStore';
import { ElementInspector } from '../../sidebar/panels/ElementInspector';

export function ContentTab() {
    const selectedElementId = useBuilderStore(state => state.selectedElementId);
    const updateWebsiteProps = useBuilderStore(state => state.updateWebsiteProps);
    const websiteName = useBuilderStore(state => state.present.websiteProps.name);

    if (selectedElementId) return <ElementInspector />;

    return (
        <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Site Settings</p>
            <div>
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-1.5 block">
                    Site Name
                </label>
                <input
                    type="text"
                    value={websiteName}
                    onChange={(e) => updateWebsiteProps({ name: e.target.value })}
                    aria-label="Site name"
                    className="w-full bg-gray-950 border border-gray-800 rounded-lg p-3 text-sm text-white outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
                />
            </div>
            <p className="text-xs text-gray-600 text-center mt-8">
                Select an element on the canvas to edit its content.
            </p>
        </div>
    );
}
