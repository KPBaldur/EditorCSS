
import React, { useState } from 'react';
import { useEditorStore } from '../store';


/* import { useEditorStore } from '../store'; */

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { EditorComponent } from '../types';
import ViewportControls from './ViewportControls';

/* Container Component with Droppable Area */
const ContainerItem: React.FC<{ component: EditorComponent; children: React.ReactNode }> = ({ component, children }) => {
  const { isOver, setNodeRef } = useDroppable({
    id: component.id, // Droppable ID matches component ID
    data: { type: 'container', parentId: component.id }
  });

  return (
    <div
      ref={setNodeRef}
      className={`p-4 border border-dashed rounded min-w-[200px] min-h-[100px] flex flex-col gap-2 transition-colors ${isOver ? 'border-primary bg-primary/5' : 'border-white/20 bg-white/5'
        }`}
    >
      <div className="text-[10px] text-slate-500 uppercase mb-2 select-none">{component.name}</div>
      <div className="flex-1 flex flex-col gap-2">
        {children}
      </div>
    </div>
  );
};

/* Sortable Item Wrapper */
const SortableItem: React.FC<{ component: EditorComponent }> = ({ component }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: component.id, data: { type: component.id } }); // Use ID for sortable

  // Grid Positioning for Root Items
  const { colStart, colEnd, rowStart, rowEnd } = component.gridProps || { colStart: 1, colEnd: 13, rowStart: 'auto', rowEnd: 'auto' };

  // Style Props
  const { padding, margin, backgroundColor, gap: innerGap } = component.styleProps || { padding: 0, margin: 0, gap: 0, backgroundColor: 'transparent' };

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,

    // Grid Placement (Applied if this item is a direct child of the Grid Canvas)
    gridColumn: `${colStart} / ${colEnd}`,
    gridRow: `${rowStart} / ${rowEnd}`,

    // Box Model
    padding: `${padding}px`,
    margin: `${margin}px`,
    backgroundColor: backgroundColor || 'transparent',

    // Internal Layout (Semantic components act as containers)
    display: component.type === 'image' || component.type === 'button' || component.type === 'text' ? 'block' : 'flex',
    flexDirection: 'column',
    gap: `${innerGap}px`,
    border: '1px dashed rgba(255,255,255,0.1)',
    borderRadius: '8px',
  };

  // Get children if it's a container
  const allComponents = useEditorStore(state => state.components);
  const childComponents = allComponents.filter(c => c.children?.includes(component.id) || c.parentId === component.id);

  const renderContent = () => {
    // Semantic & Atomic Rendering
    switch (component.type) {
      case 'header':
      case 'footer':
      case 'main':
      case 'sidebar':
      case 'container':
        return (
          <ContainerItem component={component}>
            {childrenContent()}
          </ContainerItem>
        );
      case 'button':
        return <button className="bg-primary text-background-dark font-bold py-2 px-6 rounded shadow pointer-events-none w-full">{component.name}</button>;
      case 'text':
        return <div className="text-slate-200 p-2 pointer-events-none"><h4>{component.name}</h4><p className="text-xs text-slate-400">Lorem ipsum content.</p></div>;
      case 'image':
        return <div className="w-full h-32 bg-slate-700/50 rounded flex items-center justify-center text-xs text-slate-500 pointer-events-none icon-xl">IMAGE</div>;
      default:
        return null;
    }
  };

  const childrenContent = () => {
    if (childComponents.length === 0) {
      return <div className="text-[10px] text-slate-600 uppercase tracking-widest text-center py-8">Empty {component.name}</div>;
    }
    return (
      <SortableContext
        items={childComponents.map(c => c.id)}
        strategy={verticalListSortingStrategy}
      >
        {childComponents.map(child => (
          <SortableItem key={child.id} component={child} />
        ))}
      </SortableContext>
    );
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing relative group overflow-hidden">
      {/* Label for Semantic Regions */}
      {(['header', 'footer', 'main', 'sidebar'].includes(component.type)) && (
        <div className="absolute top-0 right-0 bg-primary/20 text-primary text-[9px] px-2 py-0.5 rounded-bl font-mono font-bold uppercase z-10">
          {component.name}
        </div>
      )}
      {renderContent()}
    </div>
  );
};

const Canvas: React.FC = () => {
  /* Store Selectors */
  const components = useEditorStore((state) => state.components);
  const gridConfig = useEditorStore((state) => state.gridConfig); // Default { columns: 12, rows: 12, gap: 20 }

  // Root components are those placed directly on the Grid
  const rootComponents = components.filter(c => !c.parentId);

  const radius = useEditorStore((state) => state.radius);
  const viewportWidth = useEditorStore((state) => state.viewportWidth);
  const viewportHeight = useEditorStore((state) => state.viewportHeight);

  const [showDeviceMenu, setShowDeviceMenu] = useState(false);
  const [scale, setScale] = useState(1);
  const [showGridLines, setShowGridLines] = useState(true);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.2));

  const { isOver, setNodeRef } = useDroppable({
    id: 'canvas-droppable',
  });

  /* Logic for Visuals */
  const isDesktop = viewportWidth >= 1366;
  const effectiveRadius = isDesktop ? 0 : radius;

  // Grid Style
  const containerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridConfig?.columns || 12}, 1fr)`,
    gridAutoRows: 'minmax(50px, auto)',
    gap: `${gridConfig?.gap || 20}px`,

    borderRadius: `${effectiveRadius}px`,
    backgroundColor: '#1F2022',
    width: `${viewportWidth}px`,
    height: `${viewportHeight}px`,
    transition: 'all 0.3s ease-out',
    transform: `scale(${scale})`,
    transformOrigin: 'center center',
    padding: '20px', // Canvas padding
    alignContent: 'start', // Don't stretch rows unnecessarily
  };

  // Grid Lines Overlay generator
  const renderGridLines = () => {
    if (!showGridLines) return null;
    const cols = gridConfig?.columns || 12;
    const rows = gridConfig?.rows || 12; // Use configured rows or default 12 for visualization

    return (
      <div className="absolute inset-0 pointer-events-none z-0 p-[20px]" style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, minmax(50px, 1fr))`,
        gap: `${gridConfig?.gap || 20}px`,
        width: '100%',
        height: '100%'
      }}>
        {/* Render Cells instead of just Columns */}
        {Array.from({ length: cols * rows }).map((_, i) => (
          <div key={i} className="bg-primary/5 border border-primary/5 rounded-sm relative opacity-50">
            {/* Optional: Add numbering or coordinates for debug
             <span className="text-[8px] text-primary/20 p-1">{i+1}</span> 
             */}
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="flex-1 bg-canvas-dark canvas-grid flex flex-col relative overflow-hidden">
      {/* Viewport Info */}
      <div className="absolute top-4 left-6 flex items-center gap-4 z-20">
        <div className="bg-panel-dark px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-3 shadow-2xl">
          <span className="text-[10px] text-slate-500 font-bold">GRID:</span>
          <span className="text-[10px] text-white font-mono">{gridConfig?.columns || 12} cols</span>
          <div className="w-px h-3 bg-white/10 mx-1"></div>
          <span className="text-[10px] text-slate-500 font-bold">SIZE:</span>
          <span className="text-[10px] text-white font-mono">{viewportWidth} × {viewportHeight}</span>
          <div className="w-px h-3 bg-white/10 mx-1"></div>
          <span className="text-[10px] text-primary font-mono">{Math.round(scale * 100)}%</span>
        </div>
      </div>

      {/* Main Preview Container Scroll Area */}
      <div className="flex-1 overflow-auto relative w-full h-full">
        <div className="min-w-full min-h-full flex items-center justify-center p-20 w-max h-max">
          <div
            ref={setNodeRef}
            className={`shrink-0 border-2 shadow-[0_0_40px_rgba(0,214,189,0.15)] relative group transition-all duration-300 ${isOver ? 'border-secondary ring-2 ring-secondary/20' : 'border-primary'}`}
            style={containerStyle}
          >
            {/* Visual Grid Overlay */}
            {renderGridLines()}

            <div className="relative z-10 w-full h-full" style={{ display: 'contents' }}>
              {rootComponents.length === 0 ? (
                <div className="col-span-full row-span-4 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center text-slate-500 font-mono text-sm">
                  Arrastra "Header" o "Main" aquí para empezar tu layout.
                </div>
              ) : (
                <SortableContext
                  items={rootComponents.map(c => c.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {rootComponents.map(comp => (
                    <SortableItem key={comp.id} component={comp} />
                  ))}
                </SortableContext>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Floating Toolbar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-panel-dark/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full flex gap-4 shadow-2xl z-20">
        <button onClick={handleZoomIn} className="p-2 text-primary hover:bg-white/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">zoom_in</span>
        </button>
        <button onClick={handleZoomOut} className="p-2 text-slate-400 hover:bg-white/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">zoom_out</span>
        </button>
        <div className="w-px h-6 bg-white/10 my-1"></div>
        <button
          onClick={() => setShowDeviceMenu(!showDeviceMenu)}
          className={`p-2 rounded-full transition-colors relative ${showDeviceMenu ? 'text-primary bg-white/10' : 'text-slate-400 hover:bg-white/5'}`}
        >
          <span className="material-symbols-outlined">devices</span>
        </button>
        <button
          onClick={() => setShowGridLines(!showGridLines)}
          className={`p-2 rounded-full transition-colors ${showGridLines ? 'text-primary bg-white/10' : 'text-slate-400 hover:bg-white/5'}`}
        >
          <span className="material-symbols-outlined">grid_on</span>
        </button>
      </div>

      {showDeviceMenu && <ViewportControls onClose={() => setShowDeviceMenu(false)} />}
    </section>
  );
};

export default Canvas;
