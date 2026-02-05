import { create } from 'zustand';
import { EditorState, EditorComponent } from './types';


interface EditorStore extends EditorState {
    components: EditorComponent[];
    selectedId: string | null;

    // Actions
    updateState: (updates: Partial<EditorState>) => void;
    addComponent: (type: string, parentId?: string) => void;
    removeComponent: (id: string) => void;
    selectComponent: (id: string | null) => void;
    reorderComponents: (activeId: string, overId: string) => void;
}

const initialState: EditorState = {
    // Grid Defaults: 12 Columns, auto rows (visualized as 12 for now), 20px gap
    gridConfig: { columns: 12, rows: 12, gap: 20 },

    layoutDirection: 'row',
    alignment: 'center',
    gap: 24,
    radius: 16,
    primaryColor: '#00d6bd',
    viewportWidth: 1440,
    viewportHeight: 900,
};

export const useEditorStore = create<EditorStore>((set) => ({
    ...initialState,
    components: [],
    selectedId: null,

    updateState: (updates) => set((state) => ({ ...state, ...updates })),

    addComponent: (type, parentId) => set((state) => {
        // Improved Grid Placement Logic
        const isRoot = !parentId;
        let initialGridProps: GridProps = { colStart: 1, colEnd: 5, rowStart: 1, rowEnd: 2 }; // Default

        // Define default spans based on type
        let span = 4;
        if (type === 'header' || type === 'footer') span = 12;
        if (type === 'main') span = 8;
        if (type === 'sidebar') span = 4;
        if (type === 'container') span = 6;
        if (type === 'text' || type === 'button' || type === 'image') span = 12;

        if (isRoot) {
            const rootComponents = state.components.filter(c => !c.parentId);

            // Find the maximum row used so far to append below
            let maxRow = 1;
            rootComponents.forEach(c => {
                if (c.gridProps && c.gridProps.rowEnd > maxRow) {
                    maxRow = c.gridProps.rowEnd;
                }
            });

            initialGridProps = {
                colStart: 1,
                colEnd: 1 + span,
                rowStart: maxRow,
                rowEnd: maxRow + 1 // Default height 1 row
            };
        }

        const newComponent: EditorComponent = {
            id: crypto.randomUUID(),
            type: type as any,
            name: type.charAt(0).toUpperCase() + type.slice(1),
            props: {},
            children: [],
            parentId: parentId,

            gridProps: initialGridProps,
            styleProps: {
                padding: 16,
                margin: 0,
                gap: 16,
                backgroundColor: 'rgba(255,255,255,0.05)'
            }
        };
        return { components: [...state.components, newComponent] };
    }),

    removeComponent: (id) => set((state) => ({
        components: state.components.filter((c) => c.id !== id),
        selectedId: state.selectedId === id ? null : state.selectedId,
    })),

    selectComponent: (id) => set({ selectedId: id }),

    reorderComponents: (activeId, overId) => set((state) => {
        // ... (Keep existing logic if needed for internal lists, or remove if purely grid)
        const oldIndex = state.components.findIndex((c) => c.id === activeId);
        const newIndex = state.components.findIndex((c) => c.id === overId);

        if (oldIndex !== -1 && newIndex !== -1) {
            const newComponents = [...state.components];
            const [movedItem] = newComponents.splice(oldIndex, 1);
            newComponents.splice(newIndex, 0, movedItem);
            return { components: newComponents };
        }
        return state;
    })
}));
