import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIComponent, TemplateComponent } from '@/types';

interface UIBuilderState {
  selectedComponent: UIComponent | null;
  components: UIComponent[];
  templates: TemplateComponent[];
  history: {
    past: UIComponent[][];
    present: UIComponent[];
    future: UIComponent[][];
  };
  canvasData: any;
  leftPanelWidth: number;
  rightPanelWidth: number;
  showPageManager: boolean;
  showPreview: boolean;
  pages: Array<{
    id: string;
    name: string;
    components: UIComponent[];
    isActive: boolean;
  }>;
  currentPageId: string;
}

const initialState: UIBuilderState = {
  selectedComponent: null,
  components: [],
  templates: [],
  history: {
    past: [],
    present: [],
    future: [],
  },
  canvasData: null,
  leftPanelWidth: 320,
  rightPanelWidth: 320,
  showPageManager: false,
  showPreview: false,
  pages: [
    {
      id: 'page-1',
      name: 'Home',
      components: [],
      isActive: true,
    },
  ],
  currentPageId: 'page-1',
};

const uiBuilderSlice = createSlice({
  name: 'uiBuilder',
  initialState,
  reducers: {
    setSelectedComponent: (state, action: PayloadAction<UIComponent | null>) => {
      state.selectedComponent = action.payload;
    },
    addComponent: (state, action: PayloadAction<UIComponent>) => {
      const newComponents = [...state.components, action.payload];
      state.history.past.push(state.components);
      state.history.present = newComponents;
      state.history.future = [];
      state.components = newComponents;
    },
    updateComponent: (state, action: PayloadAction<{ id: string; updates: Partial<UIComponent> }>) => {
      const { id, updates } = action.payload;
      const newComponents = state.components.map(comp =>
        comp.id === id ? { ...comp, ...updates } : comp
      );
      state.history.past.push(state.components);
      state.history.present = newComponents;
      state.history.future = [];
      state.components = newComponents;
    },
    removeComponent: (state, action: PayloadAction<string>) => {
      const newComponents = state.components.filter(comp => comp.id !== action.payload);
      state.history.past.push(state.components);
      state.history.present = newComponents;
      state.history.future = [];
      state.components = newComponents;
      if (state.selectedComponent?.id === action.payload) {
        state.selectedComponent = null;
      }
    },
    undo: (state) => {
      if (state.history.past.length > 0) {
        const previous = state.history.past[state.history.past.length - 1];
        const newPast = state.history.past.slice(0, -1);
        
        state.history.future = [state.components, ...state.history.future];
        state.history.past = newPast;
        state.history.present = previous;
        state.components = previous;
      }
    },
    redo: (state) => {
      if (state.history.future.length > 0) {
        const next = state.history.future[0];
        const newFuture = state.history.future.slice(1);
        
        state.history.past = [...state.history.past, state.components];
        state.history.present = next;
        state.history.future = newFuture;
        state.components = next;
      }
    },
    setCanvasData: (state, action: PayloadAction<any>) => {
      state.canvasData = action.payload;
    },
    setLeftPanelWidth: (state, action: PayloadAction<number>) => {
      state.leftPanelWidth = action.payload;
    },
    setRightPanelWidth: (state, action: PayloadAction<number>) => {
      state.rightPanelWidth = action.payload;
    },
    setShowPageManager: (state, action: PayloadAction<boolean>) => {
      state.showPageManager = action.payload;
    },
    setShowPreview: (state, action: PayloadAction<boolean>) => {
      state.showPreview = action.payload;
    },
    addPage: (state, action: PayloadAction<{ id: string; name: string }>) => {
      state.pages.push({
        id: action.payload.id,
        name: action.payload.name,
        components: [],
        isActive: false,
      });
    },
    setCurrentPage: (state, action: PayloadAction<string>) => {
      state.currentPageId = action.payload;
      state.pages = state.pages.map(page => ({
        ...page,
        isActive: page.id === action.payload,
      }));
    },
    updatePageComponents: (state, action: PayloadAction<{ pageId: string; components: UIComponent[] }>) => {
      const { pageId, components } = action.payload;
      state.pages = state.pages.map(page =>
        page.id === pageId ? { ...page, components } : page
      );
      if (pageId === state.currentPageId) {
        state.components = components;
      }
    },
  },
});

export const {
  setSelectedComponent,
  addComponent,
  updateComponent,
  removeComponent,
  undo,
  redo,
  setCanvasData,
  setLeftPanelWidth,
  setRightPanelWidth,
  setShowPageManager,
  setShowPreview,
  addPage,
  setCurrentPage,
  updatePageComponents,
} = uiBuilderSlice.actions;

export default uiBuilderSlice.reducer;
