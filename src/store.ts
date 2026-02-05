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
        const newComponent: EditorComponent = {
            id: crypto.randomUUID(),
            type: type as any, // TODO: Fix type
            name: type.charAt(0).toUpperCase() + type.slice(1),
            props: {},
            children: [],
            parentId: parentId, // Set the parent ID
        };
        return { components: [...state.components, newComponent] };
    }),

    removeComponent: (id) => set((state) => ({
        components: state.components.filter((c) => c.id !== id),
        selectedId: state.selectedId === id ? null : state.selectedId,
    })),

    selectComponent: (id) => set({ selectedId: id }),

    reorderComponents: (activeId, overId) => set((state) => {
        const oldIndex = state.components.findIndex((c) => c.id === activeId);
        const newIndex = state.components.findIndex((c) => c.id === overId);

        if (oldIndex !== -1 && newIndex !== -1) {
            // Simple array move logic
            const newComponents = [...state.components];
            const [movedItem] = newComponents.splice(oldIndex, 1);
            newComponents.splice(newIndex, 0, movedItem);
            return { components: newComponents };
        }
        return state;
    })
}));
