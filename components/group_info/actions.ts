import { AppDispatch, RootState } from '../../store/store';
import type {
  iGroupAllDetails,
  iGroupMapping,
  iGroupMemberData,
} from '../../types/group';
import type { iGroupAllDetailsInput } from './GroupAllDetailsForm';
import { addNewGroup, deleteGroup, editGroup } from './groupInfoSlice';
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
      onError('Name is already registered');
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
        onError('Name is already taken');
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
          onError(
            `Group ${recursiveGroupName} is recursive remove that and try again.`
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
    } else onError('Group not Found');
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
      dispatch(deleteGroup(body));
    } else {
      onError('Can not remove this group.');
      console.log('Can not remove this group.');
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
