import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  employeeData,
  employeeDataEmailId,
  employeeDataName,
  employeeDataPhoneNumber,
  employeeDataUsername,
} from '../../data/employee';
import { RootState } from '../../store/store';
import iEmployee from '../../types/employee';
interface iInitialState {
  employee: Record<number, iEmployee>;
  employeeUsername: Record<string, number>;
  employeeName: Record<string, number>;
  employeeEmailId: Record<string, number>;
  employeePhoneNumber: Record<string, number>;
}
export const EmployeeSlice = createSlice({
  name: 'employee',
  initialState: {
    employee: employeeData,
    employeeUsername: employeeDataUsername,
    employeeName: employeeDataName,
    employeeEmailId: employeeDataEmailId,
    employeePhoneNumber: employeeDataPhoneNumber,
  } as iInitialState,
  reducers: {
    addNewEmployee: (state, actions: PayloadAction<iEmployee>) => {
      const id = actions.payload.id;
      actions.payload.email_id = actions.payload.email_id.toLowerCase();
      state.employee[id] = actions.payload;
      state.employeeUsername[actions.payload.username.toLowerCase()] = id;
      state.employeeName[actions.payload.name.toLowerCase()] = id;
      state.employeeEmailId[actions.payload.email_id] = id;
      state.employeePhoneNumber[actions.payload.phone_number] = id;
    },
    editEmployee: (state, actions: PayloadAction<iEmployee>) => {
      const id = actions.payload.id;
      actions.payload.email_id = actions.payload.email_id.toLowerCase();
      const previouseData = { ...state.employee[id] };

      delete state.employeeName[previouseData.name.toLowerCase()];
      delete state.employeeUsername[previouseData.username.toLowerCase()];
      delete state.employeeEmailId[previouseData.email_id];
      delete state.employeePhoneNumber[previouseData.phone_number];

      state.employeeUsername[actions.payload.username.toLowerCase()] = id;
      state.employeeName[actions.payload.name.toLowerCase()] = id;
      state.employeeEmailId[actions.payload.email_id] = id;
      state.employeePhoneNumber[actions.payload.phone_number] = id;
      state.employee[id] = actions.payload;
    },
    deleteEmployee: (state, actions: PayloadAction<iEmployee>) => {
      const id = actions.payload.id;
      delete state.employee[id];
      delete state.employeeUsername[actions.payload.username.toLowerCase()];
      delete state.employeeName[actions.payload.name.toLowerCase()];
      delete state.employeeEmailId[actions.payload.email_id];
      delete state.employeePhoneNumber[actions.payload.phone_number];
    },
  },
});
export const { addNewEmployee, editEmployee, deleteEmployee } =
  EmployeeSlice.actions;
export const selectAllEmployee = (state: RootState) =>
  Object.values(state.employee.employee);
export const selectAllEmployeeById = (state: RootState) =>
  state.employee.employee;
export default EmployeeSlice.reducer;
