
import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useEditorStore } from '../store';
import { EditorComponent } from '../types';

const DraggableItem: React.FC<{ id: string; name: string; icon: string; collapsed?: boolean }> = ({ id, name, icon, collapsed }) => {
  const data = React.useMemo(() => ({ type: id }), [id]);
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `sidebar-${id}`,
    data,
  });

  const style = transform ? {
    transform: CSS.Translate.toString(transform),
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group flex items-center gap-3 p-3 bg-panel-dark/50 border border-white/5 rounded-xl hover:border-primary/50 cursor-grab active:cursor-grabbing transition-all hover:bg-panel-dark ${isDragging ? 'opacity-50' : ''} ${collapsed ? 'justify-center' : ''}`}
      title={collapsed ? name : undefined}
    >
      <div className="bg-primary/10 p-2 rounded-lg text-primary transition-colors group-hover:bg-primary/20 shrink-0">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      {!collapsed && <span className="text-xs font-medium text-slate-300 group-hover:text-white truncate">{name}</span>}
    </div>
  );
};

/* Recursive Structure Item */
const StructureItem: React.FC<{ component: EditorComponent; level?: number; collapsed?: boolean }> = ({ component, level = 0, collapsed }) => {
  const components = useEditorStore((state) => state.components);
  const selectedId = useEditorStore((state) => state.selectedId);
  const selectComponent = useEditorStore((state) => state.selectComponent);
  const removeComponent = useEditorStore((state) => state.removeComponent);

  // Find children
  const children = components.filter(c => c.parentId === component.id);
  const isSelected = selectedId === component.id;

  // If collapsed, ignore level indentation to keep icons centered/visible
  const paddingLeft = collapsed ? 0 : level * 12 + 8;

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete ${component.name}?`)) {
      removeComponent(component.id);
    }
  };

  return (
    <div className="flex flex-col">
      <div
        onClick={() => selectComponent(component.id)}
        className={`group/item flex items-center gap-2 text-xs py-1 px-2 rounded cursor-pointer transition-colors ${isSelected ? 'bg-primary/20 text-primary border-r-2 border-primary' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
          } ${collapsed ? 'justify-center' : ''}`}
        style={{ paddingLeft: collapsed ? 0 : `${paddingLeft}px` }}
        title={collapsed ? component.name : undefined}
      >
        <span className="material-symbols-outlined text-[14px] opacity-70 shrink-0">
          {component.type === 'container' ? 'fit_screen' :
            component.type === 'button' ? 'smart_button' :
              component.type === 'image' ? 'image' : 'text_fields'}
        </span>
        {!collapsed && <span className="truncate flex-1">{component.name}</span>}

        {/* Indicators / Actions */}
        {!collapsed && (
          <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shrink-0 mr-1"></span>}
            <button
              onClick={handleDelete}
              className="text-slate-500 hover:text-red-400 p-0.5 rounded"
              title="Delete"
            >
              <span className="material-symbols-outlined text-[12px]">delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Recursion for children */}
      {children.length > 0 && (
        <div className={`flex flex-col ${!collapsed ? 'border-l border-white/5 ml-2' : ''}`}>
          {children.map(child => (
            <StructureItem key={child.id} component={child} level={level + 1} collapsed={collapsed} />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar: React.FC = () => {
  const components = useEditorStore((state) => state.components);
  const rootComponents = components.filter(c => !c.parentId);
  const [collapsed, setCollapsed] = useState(false);

  const tools = [
    { id: 'container', name: 'Container', icon: 'square_foot' },
    { id: 'button', name: 'Action Button', icon: 'smart_button' },
    { id: 'text', name: 'Typography', icon: 'text_fields' },
    { id: 'image', name: 'Media Block', icon: 'image' },
  ];

  return (
    <aside className={`${collapsed ? 'w-20' : 'w-64'} transition-all duration-300 border-r border-white/5 bg-background-dark flex flex-col shrink-0 overflow-hidden relative`}>
      <div className={`p-6 flex-1 overflow-y-auto custom-scrollbar ${collapsed ? 'px-2' : ''}`}>

        {/* Header with Toggle */}
        <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} mb-4`}>
          {!collapsed && <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">Lista de Componentes</h2>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-slate-500 hover:text-white p-1 rounded hover:bg-white/5 transition-colors"
            title={collapsed ? "Expandir" : "Colapsar"}
          >
            <span className="material-symbols-outlined text-sm">{collapsed ? 'chevron_right' : 'chevron_left'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-3 mb-8">
          {tools.map((comp) => (
            <DraggableItem key={comp.id} {...comp} collapsed={collapsed} />
          ))}
        </div>

        <div className="pt-6 border-t border-white/5">
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} mb-4`}>
            {!collapsed && <h2 className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Estructura</h2>}
            <span className="text-[10px] bg-white/5 text-slate-500 px-1.5 py-0.5 rounded">{components.length}</span>
          </div>

          <div className="space-y-0.5 min-h-[100px]">
            {rootComponents.length === 0 ? (
              !collapsed && (
                <div className="text-center py-8 text-xs text-slate-600 italic">
                  No hay elementos agregados.
                </div>
              )
            ) : (
              rootComponents.map(comp => (
                <StructureItem key={comp.id} component={comp} collapsed={collapsed} />
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
