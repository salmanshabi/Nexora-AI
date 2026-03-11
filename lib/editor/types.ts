export type BlockType =
  | "text"
  | "image"
  | "container"
  | "button"
  | "hero"
  | "section"
  | "grid"
  | "features"
  | "pricing"
  | "testimonials"
  | "navbar";

export interface BoxStyles {
  // Spacing
  margin?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
  padding?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;

  // Layout
  display?: "block" | "inline-block" | "flex" | "grid" | "inline-flex";
  flexDirection?: "row" | "column" | "row-reverse" | "column-reverse";
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "space-evenly";
  alignItems?: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
  alignSelf?: "flex-start" | "flex-end" | "center" | "baseline" | "stretch";
  gap?: string;

  // Dimensions
  width?: string;
  height?: string;
  maxWidth?: string;
  minWidth?: string;
  minHeight?: string;
  aspectRatio?: string;
  objectFit?: string;

  // Colors & Backgrounds
  color?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: "cover" | "contain" | "auto";
  backgroundPosition?: string;
  backgroundRepeat?: "no-repeat" | "repeat" | "repeat-x" | "repeat-y";

  // Borders
  border?: string;
  borderTop?: string;
  borderBottom?: string;
  borderWidth?: string;
  borderStyle?: "solid" | "dashed" | "dotted" | "none";
  borderColor?: string;
  borderRadius?: string;

  // Typography
  fontSize?: string;
  fontWeight?: string | number;
  textAlign?: "left" | "center" | "right" | "justify";
  lineHeight?: string;
  letterSpacing?: string;
  fontFamily?: string;
  textTransform?: string;
  textDecoration?: string;

  // Effects & Positioning
  boxShadow?: string;
  opacity?: number;
  cursor?: string;
  position?: "static" | "relative" | "absolute" | "fixed" | "sticky";
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  inset?: string;
  zIndex?: number;
  
  // Grid
  gridTemplateColumns?: string;
}

export interface AnimationSettings {
  type:
    | "none"
    | "fade"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "scale"
    | "zoomIn";
  duration?: number;
  delay?: number;
  trigger?: "onLoad" | "onScroll" | "onHover";
}

export interface BlockData {
  id: string;
  type: BlockType;
  name: string;
  props?: Record<string, unknown>;
  styles?: BoxStyles;
  animations?: AnimationSettings;
  children: string[]; // Array of Block IDs
  parentId?: string | null;
  isHidden?: boolean;
  isLocked?: boolean;
}

export interface GlobalStyles {
  theme: "light" | "dark" | "system";
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    muted: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseSize: string;
  };
}

export interface EditorState {
  blocks: Record<string, BlockData>;
  rootBlockId: string;
  selectedBlockId: string | null;
  hoveredBlockId: string | null;
  draggedBlockId: string | null;
  deviceMode: "desktop" | "tablet" | "mobile";
  isPreviewMode: boolean;
  globalStyles: GlobalStyles;
  history: {
    past: Record<string, BlockData>[];
    future: Record<string, BlockData>[];
  };
}
