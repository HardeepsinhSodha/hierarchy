import { AppDispatch, RootState } from '../../store/store';
import type { iDepartment } from '../../types/department';
import {
  addNewDepartment,
  deleteDepartment,
  editDepartment,
} from './departmentSlice';

export const addNewDepartmentAPI =
  (
    body: Omit<iDepartment, 'id'>,
    onSuccess: () => void,
    onError: (message: string) => void
  ) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    if (state.department.departmentByName[body.name.toLowerCase()]) {
      onError('Department name is already exist');
    } else {
      const maxId = Object.keys(state.department.department).reduce(
        (max, value) => Math.max(max, Number(value)),
        0
      );
      onSuccess();
      dispatch(addNewDepartment({ ...body, id: maxId + 1 }));
    }
  };
export const editDepartmentAPI =
  (
    body: iDepartment,
    onSuccess: () => void,
    onError: (message: string) => void
  ) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    if (state?.department?.department?.[body.id]) {
      const previouseData = state?.department?.department?.[body.id];
      if (
        previouseData.name !== body.name &&
        state?.department?.departmentByName[body.name.toLowerCase()]
      ) {
        onError('Department name is already exist');
      } else {
        onSuccess();
        dispatch(editDepartment(body));
      }
    } else onError('Department not Found');
  };
export const deleteDepartmentAPI =
  (
    body: iDepartment,
    onSuccess: () => void,
    onError: (message: string) => void
  ) =>
  (dispatch: AppDispatch) => {
    onSuccess();
    dispatch(deleteDepartment(body));
  };
