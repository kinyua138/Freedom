import { configureStore } from '@reduxjs/toolkit';
import uiBuilderReducer from './slices/uiBuilderSlice';
import themeReducer from './slices/themeSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    uiBuilder: uiBuilderReducer,
    theme: themeReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['uiBuilder/setCanvasData'],
        ignoredPaths: ['uiBuilder.canvasData'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
