import {
  Action,
  combineReducers,
  configureStore,
  ThunkAction,
} from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import departmentReducer from '../department/departmentSlice';
import employeeReducer from '../employee/employeeSlice';
import groupReducer from '../group_info/groupInfoSlice';
import toastReducer from '../toast/toastSlice';
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['employee', 'department', 'group'], // only employeeReducer will be persisted
};

// Create the root reducer separately so we can extract the RootState type
export const rootReducer = combineReducers({
  employee: employeeReducer,
  department: departmentReducer,
  group: groupReducer,
  toast: toastReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.REACT_APP_ENV !== 'production',
});

export const persistor = persistStore(store);

export type AppDispatch = AppStore['dispatch'];
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof store | any>;
export type AppPersistor = ReturnType<typeof persistor | any>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppStore,
  unknown,
  Action<string>
>;
