export interface UIComponent {
  id: string;
  type: string;
  props: Record<string, any>;
  position: { x: number; y: number };
  style: ComponentStyle;
  interactions: ComponentInteractions;
  accessibility: ComponentAccessibility;
}

export interface ComponentStyle {
  // Colors
  backgroundColor: string;
  backgroundGradient?: { from: string; to: string; direction: string };
  textColor: string;
  borderColor: string;
  
  // Typography
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  textAlign: string;
  
  // Borders & Radius
  borderWidth: number;
  borderStyle: string;
  borderRadius: string;
  
  // Shadows & Effects
  boxShadow: string;
  opacity: number;
  
  // Layout
  width: string;
  height: string;
  margin: { top: number; right: number; bottom: number; left: number };
  padding: { top: number; right: number; bottom: number; left: number };
  
  // Transform
  rotate: number;
  scale: number;
}

export interface ComponentInteractions {
  onClick: {
    action: 'navigate' | 'modal' | 'alert' | 'custom';
    value: string;
  };
  linkUrl?: string;
  hoverAnimation: string;
}

export interface ComponentAccessibility {
  ariaLabel: string;
  tabIndex: number;
}

export interface TemplateComponent {
  type: string;
  name: string;
  icon: string;
  defaultProps: Record<string, any>;
  defaultStyle: ComponentStyle;
  defaultInteractions: ComponentInteractions;
  defaultAccessibility: ComponentAccessibility;
}

export interface SelectedComponent {
  id: string;
  type: string;
  props: Record<string, any>;
}

export interface DragData {
  type: 'template' | 'component';
  componentType: string;
  componentId?: string;
}