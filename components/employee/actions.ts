import iEmployee from '../../types/employee';
import { commonStrings } from '../../utility/CommonStrings';
import { updateOnEmployeeDelete } from '../group_info/groupInfoSlice';
import { AppDispatch, RootState } from '../store/store';
import { addNewAlert } from '../toast/toastSlice';
import { controller } from './controller';
import { addNewEmployee, deleteEmployee, editEmployee } from './employeeSlice';
const { error: E, success: S } = controller.action;

export const addNewEmployeeAPI =
  (
    body: Omit<iEmployee, 'id'>,
    onSuccess: () => void,
    onError: (message: string) => void
  ) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    if (state.employee.employeeName[body.name.toLowerCase()]) {
      onError(E.nameDuplication);
      dispatch(addNewAlert({ text: E.nameDuplication, status: 'error' }));
    } else if (state.employee.employeeUsername[body.username.toLowerCase()]) {
      onError(E.usernameDuplication);
      dispatch(addNewAlert({ text: E.usernameDuplication, status: 'error' }));
    } else if (state.employee.employeeEmailId[body.email_id.toLowerCase()]) {
      onError(E.emailIdDuplication);
      dispatch(addNewAlert({ text: E.emailIdDuplication, status: 'error' }));
    } else if (state.employee.employeePhoneNumber[body.phone_number]) {
      onError(E.phoneNoDuplication);
      dispatch(
        addNewAlert({
          text: E.phoneNoDuplication,
          status: 'error',
        })
      );
    } else {
      const maxId = Object.keys(state.employee.employee).reduce(
        (max, value) => Math.max(max, Number(value)),
        0
      );
      onSuccess();
      dispatch(
        addNewAlert({
          text: S.added(body.name),
          status: 'success',
        })
      );
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
        onError(E.nameDuplication);
        dispatch(addNewAlert({ text: E.nameDuplication, status: 'error' }));
      } else if (
        previouseData.username !== body.username &&
        state.employee.employeeUsername[body.username.toLowerCase()]
      ) {
        onError(E.usernameDuplication);
        dispatch(
          addNewAlert({
            text: E.usernameDuplication,
            status: 'error',
          })
        );
      } else if (
        previouseData.email_id !== body.email_id &&
        state.employee.employeeEmailId[body.email_id.toLowerCase()]
      ) {
        onError(E.emailIdDuplication);
        dispatch(
          addNewAlert({
            text: E.emailIdDuplication,
            status: 'error',
          })
        );
      } else if (
        previouseData.phone_number !== body.phone_number &&
        state.employee.employeePhoneNumber[body.phone_number]
      ) {
        onError(E.phoneNoDuplication);
        dispatch(
          addNewAlert({
            text: E.phoneNoDuplication,
            status: 'error',
          })
        );
      } else {
        onSuccess();
        dispatch(editEmployee(body));
        dispatch(
          addNewAlert({
            text: S.edited(body.name),
            status: 'success',
          })
        );
      }
    } else {
      onError(E.employeeNotFound);
      dispatch(addNewAlert({ text: E.employeeNotFound, status: 'error' }));
    }
  };
export const deleteEmployeeAPI =
  (
    body: iEmployee,
    onSuccess: () => void,
    onError: (message: string) => void
  ) =>
  (dispatch: AppDispatch) => {
    try {
      onSuccess();
      dispatch(deleteEmployee(body));
      dispatch(updateOnEmployeeDelete({ id: body.id }));
      dispatch(
        addNewAlert({
          text: S.deleted(body.name),
          status: 'success',
        })
      );
    } catch (error) {
      onError(error as string);
      dispatch(
        addNewAlert({ text: commonStrings.somethingWentWrong, status: 'error' })
      );
    }
  };
