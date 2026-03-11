import React from 'react';
import { useEditorStore } from '@/lib/editor/store';

// Helper component for styled inputs
const PropertyGroup = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="border-b border-[#2C2C30] p-4">
    <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{title}</h3>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

const Label = ({ children }: { children: React.ReactNode }) => (
  <label className="text-xs text-gray-500 block mb-1">{children}</label>
);

const Input = ({ value, onChange, placeholder }: { value: string, onChange: (v: string) => void, placeholder?: string }) => (
  <input 
    type="text" 
    value={value || ''} 
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full bg-[#09090B] border border-[#3f3f46] rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
  />
);

const Select = ({ value, onChange, options }: { value: string, onChange: (v: string) => void, options: { label: string, value: string }[] }) => (
  <select
    value={value || ''}
    onChange={(e) => onChange(e.target.value)}
    className="w-full bg-[#09090B] border border-[#3f3f46] rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none transition-colors appearance-none"
  >
    <option value="">Default</option>
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

export function PropertiesPanel() {
  const { 
    blocks, 
    selectedBlockId, 
    updateBlockStyles, 
    updateBlock,
    globalStyles,
    updateGlobalStyles
  } = useEditorStore();

  if (!selectedBlockId) {
    return (
      <div className="w-72 border-l border-[#2C2C30] bg-[#18181B] flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
        <div className="p-4 border-b border-[#2C2C30] sticky top-0 bg-[#18181B]/90 backdrop-blur z-10">
          <h2 className="text-sm font-semibold text-gray-200">Global Styles</h2>
          <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">Design System</p>
        </div>
        
        <PropertyGroup title="Theme">
          <div>
            <Label>Color Mode</Label>
            <Select 
              value={globalStyles.theme} 
              onChange={(v) => updateGlobalStyles({ theme: v as 'light' | 'dark' | 'system' })}
              options={[
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' },
                { label: 'System', value: 'system' }
              ]}
            />
          </div>
        </PropertyGroup>

        <PropertyGroup title="Colors">
          {Object.entries(globalStyles.colors).map(([key, val]) => (
            <div key={key}>
              <Label>{key.charAt(0).toUpperCase() + key.slice(1)}</Label>
              <div className="flex space-x-2 border border-[#3f3f46] rounded p-1 bg-[#09090B]">
                <div 
                  className="w-5 h-5 rounded shrink-0"
                  style={{ backgroundColor: val }}
                />
                <input 
                  type="text" 
                  value={val} 
                  onChange={(e) => updateGlobalStyles({ colors: { ...globalStyles.colors, [key]: e.target.value } })}
                  className="w-full bg-transparent text-xs text-gray-200 focus:outline-none" 
                />
              </div>
            </div>
          ))}
        </PropertyGroup>

        <PropertyGroup title="Typography">
          <div>
            <Label>Heading Font</Label>
            <Input 
              value={globalStyles.typography.headingFont} 
              onChange={(v) => updateGlobalStyles({ typography: { ...globalStyles.typography, headingFont: v } })} 
            />
          </div>
          <div>
            <Label>Body Font</Label>
            <Input 
              value={globalStyles.typography.bodyFont} 
              onChange={(v) => updateGlobalStyles({ typography: { ...globalStyles.typography, bodyFont: v } })} 
            />
          </div>
          <div>
            <Label>Base Size</Label>
            <Input 
              value={globalStyles.typography.baseSize} 
              onChange={(v) => updateGlobalStyles({ typography: { ...globalStyles.typography, baseSize: v } })} 
            />
          </div>
        </PropertyGroup>
      </div>
    );
  }

  const block = blocks[selectedBlockId];
  if (!block) return null;

  const styles = block.styles || {};
  
  const handleStyleChange = (key: string, value: string) => {
    updateBlockStyles(selectedBlockId, { [key]: value });
  };

  const hasTextContent = block.type === 'text' || block.type === 'button';

  return (
    <div className="w-72 border-l border-[#2C2C30] bg-[#18181B] flex flex-col shrink-0 overflow-y-auto custom-scrollbar">
      <div className="p-4 border-b border-[#2C2C30] sticky top-0 bg-[#18181B]/90 backdrop-blur z-10">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-200 truncate">{block.name}</h2>
          <span className="text-[10px] bg-[#2C2C30] text-gray-400 px-1.5 py-0.5 rounded uppercase">{block.type}</span>
        </div>
      </div>

      {hasTextContent && (
        <PropertyGroup title="Content">
          <div>
            <Label>Text Content</Label>
            <textarea
              value={(block.props?.text as string) || ''}
              onChange={(e) => updateBlock(selectedBlockId, { props: { ...block.props, text: e.target.value } })}
              className="w-full bg-[#09090B] border border-[#3f3f46] rounded px-2 py-1 text-xs text-gray-200 focus:border-blue-500 focus:outline-none min-h-[60px] resize-y custom-scrollbar"
              placeholder="Enter text..."
            />
          </div>
        </PropertyGroup>
      )}

      <PropertyGroup title="Layout">
        <div>
          <Label>Display</Label>
          <Select 
            value={styles.display || ''} 
            onChange={(v) => handleStyleChange('display', v)}
            options={[
              { label: 'Block', value: 'block' },
              { label: 'Flex', value: 'flex' },
              { label: 'Grid', value: 'grid' },
              { label: 'Inline Block', value: 'inline-block' },
            ]}
          />
        </div>
        
        {styles.display === 'flex' && (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label>Direction</Label>
                <Select 
                  value={styles.flexDirection || ''} 
                  onChange={(v) => handleStyleChange('flexDirection', v)}
                  options={[
                    { label: 'Row', value: 'row' },
                    { label: 'Column', value: 'column' },
                  ]}
                />
              </div>
              <div>
                <Label>Gap</Label>
                <Input value={styles.gap || ''} onChange={(v) => handleStyleChange('gap', v)} placeholder="e.g. 1rem" />
              </div>
            </div>
            <div>
              <Label>Justify Content</Label>
              <Select 
                value={styles.justifyContent || ''} 
                onChange={(v) => handleStyleChange('justifyContent', v)}
                options={[
                  { label: 'Start', value: 'flex-start' },
                  { label: 'Center', value: 'center' },
                  { label: 'End', value: 'flex-end' },
                  { label: 'Space Between', value: 'space-between' },
                ]}
              />
            </div>
            <div>
              <Label>Align Items</Label>
              <Select 
                value={styles.alignItems || ''} 
                onChange={(v) => handleStyleChange('alignItems', v)}
                options={[
                  { label: 'Start', value: 'flex-start' },
                  { label: 'Center', value: 'center' },
                  { label: 'End', value: 'flex-end' },
                  { label: 'Stretch', value: 'stretch' },
                ]}
              />
            </div>
          </>
        )}
      </PropertyGroup>

      <PropertyGroup title="Spacing">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Padding</Label>
            <Input value={styles.padding || ''} onChange={(v) => handleStyleChange('padding', v)} placeholder="16px" />
          </div>
          <div>
            <Label>Margin</Label>
            <Input value={styles.margin || ''} onChange={(v) => handleStyleChange('margin', v)} placeholder="0px" />
          </div>
        </div>
      </PropertyGroup>

      <PropertyGroup title="Dimensions">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Width</Label>
            <Input value={styles.width || ''} onChange={(v) => handleStyleChange('width', v)} placeholder="100%" />
          </div>
          <div>
            <Label>Height</Label>
            <Input value={styles.height || ''} onChange={(v) => handleStyleChange('height', v)} placeholder="auto" />
          </div>
          <div>
            <Label>Max Width</Label>
            <Input value={styles.maxWidth || ''} onChange={(v) => handleStyleChange('maxWidth', v)} placeholder="none" />
          </div>
          <div>
            <Label>Min Height</Label>
            <Input value={styles.minHeight || ''} onChange={(v) => handleStyleChange('minHeight', v)} placeholder="none" />
          </div>
        </div>
      </PropertyGroup>

      <PropertyGroup title="Typography">
        <div>
          <Label>Color</Label>
          <div className="flex space-x-2">
            <div 
              className="w-6 h-6 rounded border border-[#3f3f46] overflow-hidden shrink-0"
              style={{ backgroundColor: styles.color || 'transparent' }}
            />
            <Input value={styles.color || ''} onChange={(v) => handleStyleChange('color', v)} placeholder="#ffffff" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div>
            <Label>Font Size</Label>
            <Input value={styles.fontSize || ''} onChange={(v) => handleStyleChange('fontSize', v)} placeholder="16px" />
          </div>
          <div>
            <Label>Font Weight</Label>
            <Select 
              value={styles.fontWeight?.toString() || ''} 
              onChange={(v) => handleStyleChange('fontWeight', v)}
              options={[
                { label: 'Normal', value: '400' },
                { label: 'Medium', value: '500' },
                { label: 'Semibold', value: '600' },
                { label: 'Bold', value: '700' },
              ]}
            />
          </div>
        </div>
        <div className="mt-3">
          <Label>Text Align</Label>
          <Select 
            value={styles.textAlign || ''} 
            onChange={(v) => handleStyleChange('textAlign', v)}
            options={[
              { label: 'Left', value: 'left' },
              { label: 'Center', value: 'center' },
              { label: 'Right', value: 'right' },
            ]}
          />
        </div>
      </PropertyGroup>

      <PropertyGroup title="Effects">
        <div>
          <Label>Box Shadow</Label>
          <Select 
            value={styles.boxShadow || ''} 
            onChange={(v) => handleStyleChange('boxShadow', v)}
            options={[
              { label: 'None', value: 'none' },
              { label: 'Small', value: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },
              { label: 'Medium', value: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' },
              { label: 'Large', value: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' },
              { label: 'Extra Large', value: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' },
            ]}
          />
        </div>
      </PropertyGroup>

      <PropertyGroup title="Background & Borders">
        <div>
          <Label>Background Color</Label>
          <div className="flex space-x-2">
            <div 
              className="w-6 h-6 rounded border border-[#3f3f46] overflow-hidden shrink-0 relative flex items-center justify-center"
              style={{ backgroundColor: styles.backgroundColor || 'transparent' }}
            >
              {!styles.backgroundColor && <div className="w-8 h-px bg-red-500 rotate-45 absolute" />}
            </div>
            <Input value={styles.backgroundColor || ''} onChange={(v) => handleStyleChange('backgroundColor', v)} placeholder="#000000" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div>
            <Label>Border Radius</Label>
            <Input value={styles.borderRadius || ''} onChange={(v) => handleStyleChange('borderRadius', v)} placeholder="0px" />
          </div>
          <div>
            <Label>Border</Label>
            <Input value={styles.border || ''} onChange={(v) => handleStyleChange('border', v)} placeholder="1px solid #e5e5e5" />
          </div>
        </div>
      </PropertyGroup>
      <PropertyGroup title="Animations">
        <div>
          <Label>Type</Label>
          <Select 
            value={block.animations?.type || 'none'} 
            onChange={(v) => updateBlock(selectedBlockId, { animations: { ...block.animations, type: v as 'none' | 'fade' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight' | 'scale' | 'zoomIn' } })}
            options={[
              { label: 'None', value: 'none' },
              { label: 'Fade In', value: 'fade' },
              { label: 'Slide Up', value: 'slideUp' },
              { label: 'Slide Down', value: 'slideDown' },
              { label: 'Scale', value: 'scale' },
            ]}
          />
        </div>
        {block.animations?.type && block.animations.type !== 'none' && (
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div>
              <Label>Duration (s)</Label>
              <Input 
                value={block.animations?.duration?.toString() || '0.5'} 
                onChange={(v) => updateBlock(selectedBlockId, { animations: { ...block.animations!, duration: parseFloat(v) } })} 
                placeholder="0.5" 
              />
            </div>
            <div>
              <Label>Delay (s)</Label>
              <Input 
                value={block.animations?.delay?.toString() || '0'} 
                onChange={(v) => updateBlock(selectedBlockId, { animations: { ...block.animations!, delay: parseFloat(v) } })} 
                placeholder="0" 
              />
            </div>
          </div>
        )}
      </PropertyGroup>
    </div>
  );
}
