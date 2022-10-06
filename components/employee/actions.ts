import { AppDispatch, RootState } from '../../store/store';
import iEmployee from '../../types/employee';
import { addNewEmployee, deleteEmployee, editEmployee } from './employeeSlice';

export const addNewEmployeeAPI =
  (
    body: Omit<iEmployee, 'id'>,
    onSuccess: () => void,
    onError: (message: string) => void
  ) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    if (state.employee.employeeName[body.name.toLowerCase()]) {
      onError('Name is already registered');
    } else if (state.employee.employeeUsername[body.username.toLowerCase()]) {
      onError('Username is already taken');
    } else if (state.employee.employeeEmailId[body.email_id.toLowerCase()]) {
      onError('Email id is already registered');
    } else if (state.employee.employeePhoneNumber[body.phone_number]) {
      onError('Phone number is already registered');
    } else {
      const maxId = Object.keys(state.employee.employee).reduce(
        (max, value) => Math.max(max, Number(value)),
        0
      );
      onSuccess();
      dispatch(addNewEmployee({ ...body, id: maxId + 1 }));
    }
  };
export const editEmployeeAPI =
  (
    body: iEmployee,
    onSuccess: () => void,
    onError: (message: string) => void
  ) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    if (state?.employee?.employee?.[body.id]) {
      const previouseData = state?.employee?.employee?.[body.id];
      if (
        previouseData.name !== body.name &&
        state?.employee?.employeeName[body.name.toLowerCase()]
      ) {
        onError('Employee not Found');
      } else if (
        previouseData.username !== body.username &&
        state.employee.employeeUsername[body.username.toLowerCase()]
      ) {
        onError('Username is already taken');
      } else if (
        previouseData.email_id !== body.email_id &&
        state.employee.employeeEmailId[body.email_id.toLowerCase()]
      ) {
        onError('Email id is already registered');
      } else if (
        previouseData.phone_number !== body.phone_number &&
        state.employee.employeePhoneNumber[body.phone_number]
      ) {
        onError('Phone number is already registered');
      } else {
        onSuccess();
        dispatch(editEmployee(body));
      }
    } else onError('Employee not Found');
  };
export const deleteEmployeeAPI =
  (
    body: iEmployee,
    onSuccess: () => void,
    onError: (message: string) => void
  ) =>
  (dispatch: AppDispatch) => {
    onSuccess();
    dispatch(deleteEmployee(body));
  };
