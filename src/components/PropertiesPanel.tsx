
import React, { useState } from 'react';
import { useEditorStore } from '../store';
import CodeViewer from './CodeViewer';
import { LayoutDirection, Alignment } from '../types';

const PropertiesPanel: React.FC = () => {
  /* Store Selectors */
  const updateState = useEditorStore((state) => state.updateState);
  const layoutDirection = useEditorStore((state) => state.layoutDirection);
  const alignment = useEditorStore((state) => state.alignment);
  const gap = useEditorStore((state) => state.gap);
  const radius = useEditorStore((state) => state.radius);
  const primaryColor = useEditorStore((state) => state.primaryColor);

  const [activeTab, setActiveTab] = useState<'properties' | 'advanced'>('properties');


  return (
    <aside className="w-80 border-l border-white/5 bg-background-dark flex flex-col shrink-0 overflow-hidden">
      <div className="flex border-b border-white/5 bg-panel-dark/30">
        <button
          onClick={() => setActiveTab('properties')}
          className={`flex-1 text-[11px] font-bold py-3 uppercase tracking-widest transition-all ${activeTab === 'properties' ? 'text-white border-b-2 border-primary' : 'text-slate-500 hover:text-slate-300'
            }`}
        >
          Properties
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={`flex-1 text-[11px] font-bold py-3 uppercase tracking-widest transition-all ${activeTab === 'advanced' ? 'text-white border-b-2 border-primary' : 'text-slate-500 hover:text-slate-300'
            }`}
        >
          Advanced
        </button>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-hide">
        <div className="p-5 space-y-6">
          {/* Layout Section */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between">
              Layout
              <span className="material-symbols-outlined text-[14px]">tune</span>
            </h3>
            <div className="space-y-4">
              <div className="flex bg-panel-dark p-1 rounded-lg border border-white/5">
                <button
                  onClick={() => updateState({ layoutDirection: 'row' })}
                  className={`flex-1 py-1 text-[10px] font-bold rounded transition-all ${layoutDirection === 'row' ? 'bg-background-dark text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                    }`}
                >
                  ROW
                </button>
                <button
                  onClick={() => updateState({ layoutDirection: 'column' })}
                  className={`flex-1 py-1 text-[10px] font-bold rounded transition-all ${layoutDirection === 'column' ? 'bg-background-dark text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                    }`}
                >
                  COLUMN
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'left', icon: 'align_horizontal_left' },
                  { id: 'center', icon: 'align_horizontal_center' },
                  { id: 'right', icon: 'align_horizontal_right' },
                  { id: 'justify', icon: 'format_align_justify' },
                ].map((align) => (
                  <button
                    key={align.id}
                    onClick={() => updateState({ alignment: align.id as Alignment })}
                    className={`p-2 bg-panel-dark rounded border transition-all ${alignment === align.id
                        ? 'border-primary/50 text-primary shadow-[0_0_10px_rgba(0,214,189,0.2)]'
                        : 'border-white/5 text-slate-400 hover:text-slate-200'
                      }`}
                  >
                    <span className={`material-symbols-outlined ${alignment === align.id ? 'active-symbol' : ''}`}>
                      {align.icon}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Spacing Section */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Spacing & Radius</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>GAP</span>
                  <span className="text-primary">{gap}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={gap}
                  onChange={(e) => updateState({ gap: parseInt(e.target.value) })}
                  className="w-full h-1 bg-panel-dark rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>RADIUS</span>
                  <span className="text-primary">{radius}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="64"
                  value={radius}
                  onChange={(e) => updateState({ radius: parseInt(e.target.value) })}
                  className="w-full h-1 bg-panel-dark rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>
            </div>
          </div>

          {/* Style Controls */}
          <div>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3">Visual Style</h3>
            <div className="flex gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 bg-panel-dark p-2 rounded-lg border border-white/5 hover:border-white/10 transition-colors cursor-pointer group">
                  <div
                    className="w-4 h-4 rounded shadow-inner"
                    style={{ backgroundColor: primaryColor }}
                  ></div>
                  <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-300">
                    {primaryColor.toUpperCase()}
                  </span>
                </div>
              </div>
              <button className="p-2 bg-panel-dark rounded-lg border border-white/5 text-slate-400 hover:text-slate-200 hover:bg-panel-dark/80 transition-all">
                <span className="material-symbols-outlined">opacity</span>
              </button>
              <button className="p-2 bg-panel-dark rounded-lg border border-white/5 text-slate-400 hover:text-slate-200 hover:bg-panel-dark/80 transition-all">
                <span className="material-symbols-outlined">blur_on</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0 h-[40%] flex flex-col min-h-[250px] border-t border-white/5">
        <CodeViewer />
      </div>
    </aside>
  );
};

export default PropertiesPanel;
