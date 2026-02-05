
import React, { useState } from 'react';
import { useEditorStore } from '../store';


const CodeViewer: React.FC = () => {
  const layoutDirection = useEditorStore((state) => state.layoutDirection);
  const alignment = useEditorStore((state) => state.alignment);
  const gap = useEditorStore((state) => state.gap);
  const radius = useEditorStore((state) => state.radius);

  const [lang, setLang] = useState<'css' | 'react'>('css');

  const getAlignmentValue = () => {
    if (alignment === 'justify') return 'space-between';
    if (alignment === 'center') return 'center';
    if (alignment === 'left') return 'flex-start';
    return 'flex-end';
  };

  /* Store Selectors */
  const components = useEditorStore((state) => state.components);

  const renderCSS = () => (
    <div className="p-4 font-mono text-[11px] leading-relaxed text-slate-300 overflow-y-auto h-full">
      <div className="text-secondary">.flex-container</div> {'{'}
      <div className="pl-4">
        <span className="text-slate-500">display:</span> <span className="text-accent-purple">flex</span>;
      </div>
      <div className="pl-4">
        <span className="text-slate-500">flex-direction:</span> <span className="text-accent-purple">{layoutDirection}</span>;
      </div>
      <div className="pl-4">
        <span className="text-slate-500">gap:</span> <span className="text-primary">{gap}px</span>;
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
        <span className="text-slate-500">border-radius:</span> <span className="text-primary">{radius}px</span>;
      </div>
      {'}'}

      {/* Dynamic Children CSS (Simplified) */}
      {components.map((comp, i) => (
        <div key={comp.id} className="mt-4">
          <div className="text-secondary">.item-{i + 1}</div> {'{'}
          <div className="pl-4"><span className="text-slate-500">/* {comp.name} */</span></div>
          {'}'}
        </div>
      ))}
    </div>
  );

  const renderReact = () => (
    <div className="p-4 font-mono text-[11px] leading-relaxed text-slate-300 overflow-y-auto h-full">
      <div className="text-accent-purple italic">{'// Tailwind CSS Classes'}</div>
      <div className="text-white">
        {'<div className="'}
        <span className="text-primary">
          flex {layoutDirection === 'column' ? 'flex-col' : 'flex-row'} items-center gap-[{gap}px] rounded-[{radius}px] bg-[#1F2022]
        </span>
        {'">'}
      </div>

      {components.length === 0 ? (
        <div className="pl-4 text-slate-500">{'/* Drag components here */'}</div>
      ) : (
        components.map(comp => (
          <div key={comp.id} className="pl-4 text-slate-200">
            {`{/* ${comp.name} */}`}
            <br />
            {comp.type === 'button' ? `<button className="btn-primary">${comp.name}</button>` :
              comp.type === 'text' ? `<div><h3>Heading</h3><p>...</p></div>` :
                `<div className="p-4 border..."/>`}
          </div>
        ))
      )}

      <div className="text-white">{'</div>'}</div>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col bg-background-dark overflow-hidden">
      <div className="flex border-b border-white/5 bg-panel-dark/10 shrink-0">
        <button
          onClick={() => setLang('css')}
          className={`px-4 py-2 text-[10px] font-bold uppercase transition-all ${lang === 'css' ? 'text-primary border-b border-primary' : 'text-slate-500 hover:text-slate-300'
            }`}
        >
          CSS
        </button>
        <button
          onClick={() => setLang('react')}
          className={`px-4 py-2 text-[10px] font-bold uppercase transition-all ${lang === 'react' ? 'text-primary border-b border-primary' : 'text-slate-500 hover:text-slate-300'
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
