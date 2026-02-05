
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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Get children if it's a container
  // Note: This connects to the store to get *all* components. 
  // In a real app we might pass them down or use a selector key.
  // For now, let's just render the content.
  // We need to access the store to find children of *this* component.
  const allComponents = useEditorStore(state => state.components);
  const childComponents = allComponents.filter(c => c.children?.includes(component.id) || (c as any).parentId === component.id);
  // Wait, my type def has children array on parent. Store implementation might vary.
  // Let's assume flat list with `parentId`. I need to update types/store to match.

  // Let's stick to simple rendering for now and fix the store/types in the next step to support nesting properly.
  // I will just render the specific component UI.

  const renderContent = () => {
    switch (component.type) {
      /* ... buttons/text cases ... */
      case 'button':
        return <button className="bg-primary text-background-dark font-bold py-2 px-6 rounded shadow pointer-events-none">{component.name}</button>;
      case 'text':
        return <div className="text-slate-200 p-2 pointer-events-none"><h4>Heading</h4><p className="text-xs text-slate-400">Lorem ipsum.</p></div>;
      case 'image':
        return <div className="w-24 h-24 bg-slate-700 rounded flex items-center justify-center text-xs text-slate-500 pointer-events-none">IMAGE</div>;
      case 'container':
        return (
          <ContainerItem component={component}>
            {/* We need to render the children *here* 
                    but SortableContext expects a flat list of ids usually?
                    dnd-kit handles nested SortableContexts fine.
                */}
            <div className="text-xs text-slate-600 text-center py-4">
              Target Drop Zone (WIP)
            </div>
          </ContainerItem>
        );
      default:
        return null;
    }
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
      {renderContent()}
    </div>
  );
};

const Canvas: React.FC = () => {
  /* Store Selectors - Individual for performance and stability */
  const components = useEditorStore((state) => state.components);
  const layoutDirection = useEditorStore((state) => state.layoutDirection);
  const alignment = useEditorStore((state) => state.alignment);
  const gap = useEditorStore((state) => state.gap);
  const radius = useEditorStore((state) => state.radius);
  const primaryColor = useEditorStore((state) => state.primaryColor);
  const viewportWidth = useEditorStore((state) => state.viewportWidth);
  const viewportHeight = useEditorStore((state) => state.viewportHeight);

  const [showDeviceMenu, setShowDeviceMenu] = useState(false);
  const [scale, setScale] = useState(1);

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.1, 2));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.2));

  const { isOver, setNodeRef } = useDroppable({
    id: 'canvas-droppable',
  });

  /* Logic for Visuals */
  // Auto-remove radius for desktop-class devices (Laptop 1366+, Desktop 1920+)
  const isDesktop = viewportWidth >= 1366;
  const effectiveRadius = isDesktop ? 0 : radius;

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: layoutDirection,
    justifyContent: alignment === 'justify' ? 'space-between' :
      alignment === 'center' ? 'center' :
        alignment === 'left' ? 'flex-start' : 'flex-end',
    alignItems: 'center',
    gap: `${gap}px`,
    borderRadius: `${effectiveRadius}px`,
    backgroundColor: '#1F2022',
    width: `${viewportWidth}px`,
    height: `${viewportHeight}px`,
    transition: 'all 0.3s ease-out',
    transform: `scale(${scale})`,
    transformOrigin: 'center center',
  };

  return (
    <section className="flex-1 bg-canvas-dark canvas-grid flex flex-col relative overflow-hidden">
      {/* Viewport Info */}
      <div className="absolute top-4 left-6 flex items-center gap-4 z-20">
        <div className="bg-panel-dark px-3 py-1.5 rounded-full border border-white/5 flex items-center gap-3 shadow-2xl">
          <span className="text-[10px] text-slate-500 font-bold">VIEWPORT:</span>
          <span className="text-[10px] text-white font-mono">{viewportWidth} × {viewportHeight}</span>
          <div className="w-px h-3 bg-white/10 mx-1"></div>
          <span className="text-[10px] text-primary font-mono">{Math.round(scale * 100)}%</span>
        </div>
      </div>

      {/* Main Preview Container Scroll Area */}
      <div className="flex-1 overflow-auto relative w-full h-full">
        {/*
            Centering Wrapper:
            min-h-full & min-w-full ensures that if content is small, it centers.
            If content is large (due to zoom or viewport size), it expands and allows scrolling.
            p-20 adds 'breathing room' around the canvas so you can always scroll a bit past it.
         */}
        <div className="min-w-full min-h-full flex items-center justify-center p-20 w-max h-max">
          <div
            ref={setNodeRef}
            className={`shrink-0 border-2 shadow-[0_0_40px_rgba(0,214,189,0.15)] relative group transition-all duration-300 ${isOver ? 'border-secondary ring-2 ring-secondary/20' : 'border-primary'}`}
            style={containerStyle}
          >
            <div className="absolute -top-3 left-4 bg-primary text-background-dark text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter z-10">
              Flex Container
            </div>

            {components.length === 0 ? (
              <div className="text-slate-500 text-xs font-mono border border-dashed border-white/10 p-4 rounded">
                Drag components here...
              </div>
            ) : (
              <SortableContext
                items={components.map(c => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {components.map(comp => (
                  <SortableItem key={comp.id} component={comp} />
                ))}
              </SortableContext>
            )}

            {/* CSS Indicator Overlay */}
            <div className="absolute -top-6 right-0 text-[10px] text-primary font-mono bg-background-dark px-2 py-0.5 border border-primary/20 rounded shadow-xl">
              display: flex; gap: {gap}px;
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
        <button className="p-2 text-slate-400 hover:bg-white/5 rounded-full transition-colors">
          <span className="material-symbols-outlined">grid_on</span>
        </button>
      </div>

      {showDeviceMenu && <ViewportControls onClose={() => setShowDeviceMenu(false)} />}
    </section>
  );
};

export default Canvas;
