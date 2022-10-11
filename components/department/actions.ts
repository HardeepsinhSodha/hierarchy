import type { iDepartment } from '../../types/department';
import { commonStrings } from '../../utility/CommonStrings';
import { AppDispatch, RootState } from '../store/store';
import { addNewAlert } from '../toast/toastSlice';
import { controller } from './controller';
import {
  addNewDepartment,
  deleteDepartment,
  editDepartment,
} from './departmentSlice';
const { error: E, success: S } = controller.action;
export const addNewDepartmentAPI =
  (
    body: Omit<iDepartment, 'id'>,
    onSuccess: () => void,
    onError: (message: string) => void
  ) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    if (state.department.departmentByName[body.name.toLowerCase()]) {
      onError(E.nameDuplication);
      dispatch(
        addNewAlert({
          text: E.nameDuplication,
          status: 'error',
        })
      );
    } else {
      const maxId = Object.keys(state.department.department).reduce(
        (max, value) => Math.max(max, Number(value)),
        0
      );
      onSuccess();
      dispatch(addNewDepartment({ ...body, id: maxId + 1 }));
      dispatch(
        addNewAlert({
          text: S.added(body.name),
          status: 'success',
        })
      );
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
        onError(E.nameDuplication);
        dispatch(
          addNewAlert({
            text: E.nameDuplication,
            status: 'error',
          })
        );
      } else {
        onSuccess();
        dispatch(editDepartment(body));
        dispatch(
          addNewAlert({
            text: S.edited(body.name),
            status: 'success',
          })
        );
      }
    } else {
      onError(E.departmentNotFound);
      dispatch(addNewAlert({ text: E.departmentNotFound, status: 'error' }));
    }
  };
export const deleteDepartmentAPI =
  (
    body: iDepartment,
    onSuccess: () => void,
    onError: (message: string) => void
  ) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const state = getState();
      const canNotDeleteDepartmentGroup = Object.values(
        state.group.group
      ).reduce<Record<number, string>>((newArray, group) => {
        group.allowedDepartments.forEach((id) => {
          newArray[id] = `${group.name}, ${newArray?.[id] ?? ''}`;
        });
        return newArray;
      }, {});
      if (canNotDeleteDepartmentGroup[body.id]) {
        onError(E.groupFound(canNotDeleteDepartmentGroup[body.id]));
        dispatch(
          addNewAlert({
            text: E.groupFound(canNotDeleteDepartmentGroup[body.id]),
            status: 'error',
          })
        );
      } else {
        const canNotDeleteDepartmentEmployee = Object.values(
          state.employee.employee
        ).reduce<Record<number, string>>((newArray, employee) => {
          newArray[employee.department] = `${employee.name}, ${
            newArray?.[employee.department] ?? ''
          }`;
          return newArray;
        }, {});
        if (canNotDeleteDepartmentEmployee[body.id]) {
          onError(E.employeeFound(canNotDeleteDepartmentGroup[body.id]));
          dispatch(
            addNewAlert({
              text: E.employeeFound(canNotDeleteDepartmentGroup[body.id]),
              status: 'error',
            })
          );
        } else {
          onSuccess();
          dispatch(deleteDepartment(body));
          dispatch(
            addNewAlert({
              text: S.deleted(body.name),
              status: 'error',
            })
          );
        }
      }
    } catch (error) {
      onError(JSON.stringify(error));
      dispatch(
        addNewAlert({ text: commonStrings.somethingWentWrong, status: 'error' })
      );
    }
  };
