
import React, { useState } from 'react';
import { EditorState } from './types';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';

const App: React.FC = () => {
  const [state, setState] = useState<EditorState>({
    layoutDirection: 'row',
    alignment: 'center',
    gap: 24,
    radius: 16,
    primaryColor: '#00d6bd',
    viewportWidth: 1440,
    viewportHeight: 900,
  });

  const updateState = (updates: Partial<EditorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background-dark">
      <Navbar />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <Canvas state={state} />
        
        <PropertiesPanel state={state} updateState={updateState} />
      </div>
      
      <footer className="bg-panel-dark border-t border-white/5 px-6 py-1 flex items-center justify-between text-[10px] font-medium text-slate-500 tracking-wider shrink-0">
        <div className="flex gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span> 
            SYSTEM READY
          </span>
          <span className="text-slate-600">|</span>
          <span>NODES: 14</span>
        </div>
        <div className="flex gap-4">
          <span className="text-primary/70 uppercase">Synced to Git: Master</span>
          <span className="text-slate-600">|</span>
          <span>UTF-8</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
