import type {
  iGroupAllDetails,
  iGroupMapping,
  iGroupMemberData,
} from '../../types/group';
import { commonStrings } from '../../utility/CommonStrings';
import { AppDispatch, RootState } from '../store/store';
import { addNewAlert } from '../toast/toastSlice';
import { controller } from './controller';
import type { iGroupAllDetailsInput } from './GroupAllDetailsForm';
import { addNewGroup, deleteGroup, editGroup } from './groupInfoSlice';
const { error: E, success: S } = controller.action;
interface iEditGroupAllDetailsAPI extends iGroupAllDetailsInput {
  id: number;
}

export const addNewGroupAllDetailsAPI =
  (
    body: Omit<iGroupAllDetailsInput, 'id'>,
    onSuccess: () => void,
    onError: (message: string) => void
  ) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();

    if (state.group.groupByName[body.name.toLowerCase()]) {
      onError(E.nameDuplication);
      dispatch(addNewAlert({ text: E.nameDuplication, status: 'error' }));
      return null;
    }
    const { allowedDepartments, admin, children, members, ...rest } = body;
    const id =
      Object.keys(state.group.groupAllDetails).reduce(
        (max, value) => Math.max(max, Number(value)),
        0
      ) + 1;
    const lastGroupMappingId =
      Object.keys(state.group.groupMapping).reduce(
        (max, value) => Math.max(max, Number(value)),
        0
      ) + 1;
    const lastGroupMemberId =
      Object.keys(state.group.groupMember).reduce(
        (max, value) => Math.max(max, Number(value)),
        0
      ) + 1;
    const newAllowedDepartments: number[] =
      allowedDepartments?.map((department) => department.id) ?? [];
    const newAdmin: number = admin?.id as number;
    const newChildren: iGroupMapping[] =
      children?.map((child, index) => ({
        id: lastGroupMappingId + index,
        parent_group_id: id,
        child_group_id: child.id,
      })) ?? [];
    const newMembers: iGroupMemberData[] =
      members?.map((member, index) => ({
        id: lastGroupMemberId + index,
        group_id: id,
        employee_id: member.id,
        title: '',
        joining_date: '',
        left_data: '',
      })) ?? [];
    onSuccess();
    dispatch(
      addNewAlert({
        text: S.added(rest.name),
        status: 'success',
      })
    );
    dispatch(
      addNewGroup({
        ...rest,
        id,
        children: newChildren,
        members: newMembers,
        allowedDepartments: newAllowedDepartments,
        admin: newAdmin,
      })
    );
  };
export const editGroupAllDetailsAPI =
  (
    body: iEditGroupAllDetailsAPI,
    onSuccess: () => void,
    onError: (message: string) => void
  ) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const state = getState();
    if (state?.group?.groupAllDetails?.[body.id]) {
      const previouseData = state?.group?.groupAllDetails?.[body.id];
      if (
        previouseData.name !== body.name &&
        state?.group?.groupByName[body.name.toLowerCase()]
      ) {
        onError(E.nameDuplication);
        dispatch(addNewAlert({ text: E.nameDuplication, status: 'error' }));
      } else {
        let recursiveGroupName = '';
        body.children?.find((child) => {
          if (isGroupRecursive(child.id, body.id, state)) {
            recursiveGroupName = child.name;
            return true;
          }
          return false;
        });
        if (recursiveGroupName) {
          onError(E.recursive(recursiveGroupName));
          dispatch(
            addNewAlert({
              text: E.recursive(recursiveGroupName),
              status: 'error',
            })
          );
          return false;
        }

        const { allowedDepartments, admin, children, members, ...rest } = body;
        const id = body.id;
        const lastGroupMappingId =
          Object.keys(state.group.groupMapping).reduce(
            (max, value) => Math.max(max, Number(value)),
            0
          ) + 1;
        const lastGroupMemberId =
          Object.keys(state.group.groupMember).reduce(
            (max, value) => Math.max(max, Number(value)),
            0
          ) + 1;

        const newAllowedDepartments: number[] =
          allowedDepartments?.map((department) => department.id) ?? [];
        const newAdmin: number = admin?.id as number;
        const newChildren: iGroupMapping[] =
          children?.map((child, index) => ({
            id: lastGroupMappingId + index,
            parent_group_id: id,
            child_group_id: child.id,
          })) ?? [];
        const newMembers: iGroupMemberData[] =
          members?.map((member, index) => ({
            id: lastGroupMemberId + index,
            group_id: id,
            employee_id: member.id,
            title: '',
            joining_date: '',
            left_data: '',
          })) ?? [];
        onSuccess();
        dispatch(
          addNewAlert({
            text: S.edited(rest.name),
            status: 'success',
          })
        );
        dispatch(
          editGroup({
            ...rest,
            id,
            children: newChildren,
            members: newMembers,
            allowedDepartments: newAllowedDepartments,
            admin: newAdmin,
          })
        );
      }
    } else {
      onError(E.groupNotFound);
      dispatch(addNewAlert({ text: E.groupNotFound, status: 'error' }));
    }
  };
export const deleteGroupAllDetailsAPI =
  (
    body: iGroupAllDetails,
    onSuccess: () => void,
    onError: (message: string) => void
  ) =>
  (dispatch: AppDispatch) => {
    if (body.removable) {
      onSuccess();
      dispatch(
        addNewAlert({
          text: S.deleted(body.name),
          status: 'success',
        })
      );
      dispatch(deleteGroup(body));
    } else {
      onError(E.canNotRemove(body.name));
      dispatch(
        addNewAlert({
          text: E.canNotRemove(body.name),
          status: 'error',
        })
      );
    }
  };
export function isGroupRecursive(
  parent_group_id: number,
  child_group_id: number,
  state: RootState
): boolean {
  const children = state.group.groupAllDetails[parent_group_id]?.children;
  let result = false;
  children?.every((child) => {
    if (child.child_group_id === child_group_id) {
      result = true;
      return false;
    } else if (isGroupRecursive(child.child_group_id, child_group_id, state)) {
      result = true;
      return false;
    }
    return true;
  });
  return result;
}
export const promoteMemberAPI =
  (
    body: iGroupAllDetails,
    admin: number,
    onSuccess?: () => void,
    onError?: (message: string) => void
  ) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const state = getState();
      if (state?.group?.groupAllDetails?.[body.id]) {
        const members = body.members.filter(
          (member) => member.employee_id !== admin
        );
        dispatch(editGroup({ ...body, admin, members }));
        onSuccess?.();
        dispatch(
          addNewAlert({
            text: S.promoted,
            status: 'success',
          })
        );
      } else {
        onError?.(E.groupNotFound);
        dispatch(
          addNewAlert({
            text: E.groupNotFound,
            status: 'error',
          })
        );
      }
    } catch (error) {
      onError?.(error as string);
    }
  };
export const promoteAdminAPI =
  (
    body: iGroupAllDetails,
    admin: number,
    onSuccess?: () => void,
    onError?: (message: string) => void
  ) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const state = getState();
      if (state?.group?.groupAllDetails?.[body.id]) {
        const groupMappingId = state?.group?.groupMappingByChildId?.[body.id];
        if (groupMappingId) {
          const parent_group_id =
            state.group.groupMapping[groupMappingId].parent_group_id;
          const parentGroupDetails =
            state.group.groupAllDetails[parent_group_id];
          dispatch(editGroup({ ...parentGroupDetails, admin }));
          dispatch(editGroup({ ...body, admin: undefined }));
          onSuccess?.();
          dispatch(
            addNewAlert({
              text: S.promoted,
              status: 'success',
            })
          );
        } else {
          onError?.(S.noPlaceToPromote);
          dispatch(
            addNewAlert({
              text: S.noPlaceToPromote,
              status: 'error',
            })
          );
        }
      } else {
        onError?.(E.groupNotFound);
        dispatch(
          addNewAlert({
            text: E.groupNotFound,
            status: 'error',
          })
        );
      }
    } catch (error) {
      onError?.(error as string);
      dispatch(
        addNewAlert({ text: commonStrings.somethingWentWrong, status: 'error' })
      );
    }
  };
