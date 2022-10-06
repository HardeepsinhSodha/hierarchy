import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { departmentData, departmentDataByName } from '../../data/department';
import { RootState } from '../../store/store';
import type { iDepartment } from '../../types/department';

interface iInitialState {
  department: Record<number, iDepartment>;
  departmentByName: Record<string, number>;
}
export const DepartmentSlice = createSlice({
  name: 'department',
  initialState: {
    department: departmentData,
    departmentByName: departmentDataByName,
  } as iInitialState,
  reducers: {
    addNewDepartment: (state, actions: PayloadAction<iDepartment>) => {
      const id = actions.payload.id;
      state.department[id] = actions.payload;
      state.departmentByName[actions.payload.name.toLowerCase()] = id;
    },
    editDepartment: (state, actions: PayloadAction<iDepartment>) => {
      const id = actions.payload.id;
      const previouseData = { ...state.department[id] };
      delete state.departmentByName[previouseData.name.toLowerCase()];

      state.department[actions.payload.id] = actions.payload;
      state.departmentByName[actions.payload.name.toLowerCase()] = id;
    },
    deleteDepartment: (state, actions: PayloadAction<iDepartment>) => {
      delete state.department[actions.payload.id];
      delete state.departmentByName[actions.payload.name.toLowerCase()];
    },
  },
});
export const { addNewDepartment, editDepartment, deleteDepartment } =
  DepartmentSlice.actions;
export const selectAllDepartment = (state: RootState) =>
  Object.values(state.department.department);
export const selectAllDepartmentById = (state: RootState) =>
  state.department.department;
export default DepartmentSlice.reducer;
