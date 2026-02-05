
import React from 'react';

const Navbar: React.FC = () => {
  return (
    <header className="flex items-center justify-between border-b border-white/5 bg-background-dark px-6 py-3 shrink-0">
      <div className="flex items-center gap-4">
        <div className="bg-primary/20 p-2 rounded-lg">
          <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 45.8096C19.6865 45.8096 15.4698 44.5305 11.8832 42.134C8.29667 39.7376 5.50128 36.3314 3.85056 32.3462C2.19985 28.361 1.76794 23.9758 2.60947 19.7452C3.451 15.5145 5.52816 11.6284 8.57829 8.5783C11.6284 5.52817 15.5145 3.45101 19.7452 2.60948C23.9758 1.76795 28.361 2.19986 32.3462 3.85057C36.3314 5.50129 39.7376 8.29668 42.134 11.8833C44.5305 15.4698 45.8096 19.6865 45.8096 24L24 24L24 45.8096Z" fill="currentColor"></path>
          </svg>
        </div>
        <div>
          <h1 className="text-sm font-bold tracking-tight text-white uppercase leading-none">Nexus Visual</h1>
          <p className="text-[10px] text-slate-500 font-mono tracking-widest mt-1">v2.4.0-slate</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <nav className="flex gap-6">
          <a className="text-xs font-medium text-slate-400 hover:text-white transition-colors" href="#">Project</a>
          <a className="text-xs font-medium text-slate-400 hover:text-white transition-colors" href="#">Settings</a>
          <a className="text-xs font-medium text-slate-400 hover:text-white transition-colors" href="#">Docs</a>
        </nav>
        <div className="h-4 w-px bg-white/10"></div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 group">
            <span className="material-symbols-outlined group-hover:text-white">undo</span>
          </button>
          <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 group">
            <span className="material-symbols-outlined group-hover:text-white">redo</span>
          </button>
          <button className="ml-2 flex items-center gap-2 bg-primary px-4 py-1.5 rounded-lg text-background-dark text-xs font-bold hover:brightness-110 transition-all shadow-[0_4px_12px_rgba(0,214,189,0.2)]">
            <span className="material-symbols-outlined text-sm">cloud_upload</span>
            Export
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
