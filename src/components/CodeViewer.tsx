
import React, { useState } from 'react';
import { EditorState } from '../types';

interface CodeViewerProps {
  state: EditorState;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ state }) => {
  const [lang, setLang] = useState<'css' | 'react'>('css');

  const getAlignmentValue = () => {
    if (state.alignment === 'justify') return 'space-between';
    if (state.alignment === 'center') return 'center';
    if (state.alignment === 'left') return 'flex-start';
    return 'flex-end';
  };

  const renderCSS = () => (
    <div className="p-4 font-mono text-[11px] leading-relaxed text-slate-300 overflow-y-auto h-full">
      <div className="text-secondary">.flex-container</div> {'{'}
      <div className="pl-4">
        <span className="text-slate-500">display:</span> <span className="text-accent-purple">flex</span>;
      </div>
      <div className="pl-4">
        <span className="text-slate-500">flex-direction:</span> <span className="text-accent-purple">{state.layoutDirection}</span>;
      </div>
      <div className="pl-4">
        <span className="text-slate-500">gap:</span> <span className="text-primary">{state.gap}px</span>;
      </div>
      <div className="pl-4">
        <span className="text-slate-500">align-items:</span> <span className="text-accent-purple">center</span>;
      </div>
      <div className="pl-4">
        <span className="text-slate-500">justify-content:</span> <span className="text-accent-purple">{getAlignmentValue()}</span>;
      </div>
      <div className="pl-4">
        <span className="text-slate-500">background:</span> <span className="text-accent-purple">#1F2022</span>;
      </div>
      <div className="pl-4">
        <span className="text-slate-500">border-radius:</span> <span className="text-primary">{state.radius}px</span>;
      </div>
      {'}'}
    </div>
  );

  const renderReact = () => (
    <div className="p-4 font-mono text-[11px] leading-relaxed text-slate-300 overflow-y-auto h-full">
      <div className="text-accent-purple italic">{'// Tailwind CSS Classes'}</div>
      <div className="text-white">
        {'<div className="'}
        <span className="text-primary">
          flex {state.layoutDirection === 'column' ? 'flex-col' : 'flex-row'} items-center gap-[{state.gap}px] rounded-[{state.radius}px] bg-[#1F2022]
        </span>
        {'">'}
      </div>
      <div className="pl-4 text-slate-400">...children</div>
      <div className="text-white">{'</div>'}</div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-background-dark overflow-hidden">
      <div className="flex border-b border-white/5 bg-panel-dark/10 shrink-0">
        <button 
          onClick={() => setLang('css')}
          className={`px-4 py-2 text-[10px] font-bold uppercase transition-all ${
            lang === 'css' ? 'text-primary border-b border-primary' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          CSS
        </button>
        <button 
          onClick={() => setLang('react')}
          className={`px-4 py-2 text-[10px] font-bold uppercase transition-all ${
            lang === 'react' ? 'text-primary border-b border-primary' : 'text-slate-500 hover:text-slate-300'
          }`}
        >
          React/TSX
        </button>
      </div>
      <div className="flex-1 overflow-y-auto bg-background-dark/50">
        {lang === 'css' ? renderCSS() : renderReact()}
      </div>
    </div>
  );
};

export default CodeViewer;
