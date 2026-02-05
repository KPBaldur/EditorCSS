import React from 'react';
import { VIEWPORT_PRESETS } from '../constants';
import { useEditorStore } from '../store';

const ViewportControls: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const updateState = useEditorStore((state) => state.updateState);
    const currentWidth = useEditorStore((state) => state.viewportWidth);

    const handleSelect = (width: number, height: number) => {
        updateState({ viewportWidth: width, viewportHeight: height });
        onClose();
    };

    return (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-panel-dark border border-white/10 rounded-xl p-2 shadow-2xl flex flex-col gap-1 w-48 z-50">
            <div className="text-[10px] uppercase font-bold text-slate-500 px-2 py-1 mb-1">
                Select Zone
            </div>
            {VIEWPORT_PRESETS.map((preset) => (
                <button
                    key={preset.name}
                    onClick={() => handleSelect(preset.width, preset.height)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${currentWidth === preset.width
                            ? 'bg-primary/10 text-primary'
                            : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                        }`}
                >
                    <span className="material-symbols-outlined text-[18px]">{preset.icon}</span>
                    <div className="flex flex-col leading-none">
                        <span className="text-xs font-medium">{preset.name}</span>
                        <span className="text-[9px] opacity-60 font-mono mt-0.5">{preset.width}x{preset.height}</span>
                    </div>
                </button>
            ))}
        </div>
    );
};

export default ViewportControls;
