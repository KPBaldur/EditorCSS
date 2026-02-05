export type LayoutDirection = 'row' | 'column'; // Deprecated for Grid, kept for backward compat temporarily
export type Alignment = 'left' | 'center' | 'right' | 'justify';

export interface GridConfig {
  columns: number;
  rows: number;
  gap: number; // px
}

export interface GridProps {
  colStart: number; // 1-based index
  colEnd: number;   // 1-based index (e.g., colStart + span)
  rowStart: number;
  rowEnd: number;
}

export interface StyleProps {
  padding: number;
  margin: number;
  gap: number; // Inner gap for flex/grid items inside
  backgroundColor?: string;
}

export interface EditorState {
  // Grid System
  gridConfig: GridConfig;

  // Legacy/Global visuals
  radius: number;
  primaryColor: string;
  viewportWidth: number;
  viewportHeight: number;

  // Clean up legacy layout props if desired later
  layoutDirection: LayoutDirection;
  alignment: Alignment;
  gap: number;
}

export type ComponentType = 'container' | 'button' | 'text' | 'image' | 'header' | 'footer' | 'sidebar' | 'main';

export interface EditorComponent {
  id: string;
  type: ComponentType;
  name: string;
  props: Record<string, any>;

  // New Grid & Style props
  gridProps: GridProps;
  styleProps: StyleProps;

  children?: string[]; // IDs of children
  parentId?: string;
}


export interface ComponentItem {
  id: string;
  name: string;
  icon: string;
}
