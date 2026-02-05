
import React from 'react';

const Sidebar: React.FC = () => {
  const components = [
    { id: 'container', name: 'Container', icon: 'square_foot' },
    { id: 'button', name: 'Action Button', icon: 'smart_button' },
    { id: 'text', name: 'Typography', icon: 'text_fields' },
    { id: 'media', name: 'Media Block', icon: 'image' },
  ];

  return (
    <aside className="w-64 border-r border-white/5 bg-background-dark flex flex-col shrink-0">
      <div className="p-6">
        <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Core Components</h2>
        <div className="grid grid-cols-1 gap-3">
          {components.map((comp) => (
            <div 
              key={comp.id}
              className="group flex items-center gap-3 p-3 bg-panel-dark/50 border border-white/5 rounded-xl hover:border-primary/50 cursor-grab active:cursor-grabbing transition-all hover:bg-panel-dark"
            >
              <div className="bg-primary/10 p-2 rounded-lg text-primary transition-colors group-hover:bg-primary/20">
                <span className="material-symbols-outlined">{comp.icon}</span>
              </div>
              <span className="text-xs font-medium text-slate-300 group-hover:text-white">{comp.name}</span>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">Structure</h2>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs py-1.5 px-2 text-primary bg-primary/5 rounded border-l-2 border-primary">
              <span className="material-symbols-outlined text-sm">reorder</span>
              App Container
            </div>
            <div className="flex items-center gap-2 text-xs py-1.5 px-6 text-slate-500 hover:text-slate-300 cursor-pointer">
              <span className="material-symbols-outlined text-sm">subdirectory_arrow_right</span>
              Hero Section
            </div>
            <div className="flex items-center gap-2 text-xs py-1.5 px-6 text-slate-500 hover:text-slate-300 cursor-pointer">
              <span className="material-symbols-outlined text-sm">subdirectory_arrow_right</span>
              Features Grid
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
