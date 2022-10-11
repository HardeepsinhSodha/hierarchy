import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { iDynamicToastChild } from '../../types/toast';
import { RootState } from '../store/store';

interface iInitialState {
  alerts: iDynamicToastChild[];
}
export const ToastSlice = createSlice({
  name: 'toast',
  initialState: {
    alerts: [],
  } as iInitialState,
  reducers: {
    addNewAlert: (state, actions: PayloadAction<iDynamicToastChild>) => {
      state.alerts.push({ ...actions.payload });
    },
    removeAlert: (state, actions: PayloadAction<number>) => {
      state.alerts = state.alerts.filter((_, i) => i !== actions.payload);
    },
  },
});
export const { addNewAlert, removeAlert } = ToastSlice.actions;
export const selectAlerts = (state: RootState) => state.toast.alerts;
export default ToastSlice.reducer;
