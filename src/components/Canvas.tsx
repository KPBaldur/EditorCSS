
import React from 'react';
import { EditorState } from '../types';

interface CanvasProps {
  state: EditorState;
}

const Canvas: React.FC<CanvasProps> = ({ state }) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: state.layoutDirection,
    justifyContent: state.alignment === 'justify' ? 'space-between' : 
                    state.alignment === 'center' ? 'center' : 
                    state.alignment === 'left' ? 'flex-start' : 'flex-end',
    alignItems: 'center',
    gap: `${state.gap}px`,
    borderRadius: `${state.radius}px`,
    backgroundColor: '#1F2022',
  };

  return (
    <section className="flex-1 bg-canvas-dark canvas-grid flex items-center justify-center relative overflow-hidden">
      {/* Viewport Info */}
      <div className="absolute top-4 left-6 flex items-center gap-4">
        <div className="bg-panel-dark px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-3 shadow-2xl">
          <span className="text-[10px] text-slate-500 font-bold">VIEWPORT:</span>
          <span className="text-[10px] text-white font-mono">{state.viewportWidth} × {state.viewportHeight}</span>
          <div className="flex gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500/40"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/40"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500/40"></span>
          </div>
        </div>
      </div>

      {/* Main Preview Container */}
      <div 
        className="w-[600px] h-[300px] border-2 border-primary shadow-[0_0_40px_rgba(0,214,189,0.15)] relative group transition-all duration-300"
        style={containerStyle}
      >
        <div className="absolute -top-3 left-4 bg-primary text-background-dark text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter z-10">
          Flex Container
        </div>
        
        <button 
          className="text-background-dark font-bold py-3 px-8 rounded-lg shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
          style={{ backgroundColor: state.primaryColor }}
        >
          Explore Now
        </button>
        
        <button className="border border-white/20 text-white font-bold py-3 px-8 rounded-lg hover:bg-white/5 transition-all duration-200 active:scale-95">
          Documentation
        </button>

        {/* CSS Indicator Overlay */}
        <div className="absolute -top-6 right-0 text-[10px] text-primary font-mono bg-background-dark px-2 py-0.5 border border-primary/20 rounded shadow-xl">
          display: flex; gap: {state.gap}px;
        </div>
      </div>

      {/* Floating Toolbar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-panel-dark/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full flex gap-4 shadow-2xl">
        <button className="p-2 text-primary hover:bg-white/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">zoom_in</span>
        </button>
        <button className="p-2 text-slate-400 hover:bg-white/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">zoom_out</span>
        </button>
        <div className="w-px h-6 bg-white/10 my-1"></div>
        <button className="p-2 text-slate-400 hover:bg-white/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">devices</span>
        </button>
        <button className="p-2 text-slate-400 hover:bg-white/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">grid_on</span>
        </button>
      </div>
    </section>
  );
};

export default Canvas;
