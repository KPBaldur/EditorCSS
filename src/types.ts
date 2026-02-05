
export type LayoutDirection = 'row' | 'column';
export type Alignment = 'left' | 'center' | 'right' | 'justify';

export interface EditorState {
  layoutDirection: LayoutDirection;
  alignment: Alignment;
  gap: number;
  radius: number;
  primaryColor: string;
  viewportWidth: number;
  viewportHeight: number;
}

export type ComponentType = 'container' | 'button' | 'text' | 'image';

export interface EditorComponent {
  id: string;
  type: ComponentType;
  name: string;
  props: Record<string, any>;
  children?: string[]; // IDs of children
  parentId?: string;
}


export interface ComponentItem {
  id: string;
  name: string;
  icon: string;
}
