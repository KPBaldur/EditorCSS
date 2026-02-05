
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

export interface ComponentItem {
  id: string;
  name: string;
  icon: string;
}
