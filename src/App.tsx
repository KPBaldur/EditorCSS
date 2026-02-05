
import React, { useState } from 'react';
import { EditorState } from './types';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Canvas from './components/Canvas';
import PropertiesPanel from './components/PropertiesPanel';

import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { useEditorStore } from './store';

const App: React.FC = () => {
  const addComponent = useEditorStore((state) => state.addComponent);
  const reorderComponents = useEditorStore((state) => state.reorderComponents);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    // Helper: Check if active item is a sidebar tool (new) or existing canvas item (sort)
    const activeId = active.id as string;
    const isNewComponent = activeId.startsWith('sidebar-');

    if (isNewComponent) {
      if (over.id === 'canvas-droppable' || over.data.current?.sortable) {
        const type = active.data.current?.type;
        if (type) addComponent(type);
      }
    } else {
      // Logic for reordering existing items
      if (active.id !== over.id) {
        reorderComponents(active.id as string, over.id as string);
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-screen overflow-hidden bg-background-dark">
        <Navbar />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar />

          <Canvas />

          <PropertiesPanel />
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
    </DndContext>
  );
};

export default App;
