import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  adminIndexData,
  groupAllDetails,
  groupData,
  groupDataByName,
  groupMappingData,
  groupMappingDataByChildId,
  groupMappingDataByParentId,
  groupMemberData,
  groupMemberDataByEmployeeId,
  groupMemberDataByGroupId,
} from '../../data/group';
import type {
  iGroupAllDetails,
  iGroupData,
  iGroupMapping,
  iGroupMemberData,
  iUpdateOnEmployeeDeleteAction,
} from '../../types/group';
import { RootState } from '../store/store';
interface iInitialState {
  group: Record<number, iGroupData>;
  groupByName: Record<string, number>;
  groupMapping: Record<number, iGroupMapping>;
  groupMappingByChildId: Record<number, number>;
  groupMappingByParentId: Record<number, number[]>;
  groupMember: Record<number, iGroupMemberData>;
  groupMemberByGroupId: Record<number, number[]>;
  groupAllDetails: Record<number, iGroupAllDetails>;
  groupMemberByEmployeeId: Record<number, number[]>;
  adminIndex: Record<number, number[]>;
}
export const GroupSlice = createSlice({
  name: 'group',
  initialState: {
    group: groupData,
    groupByName: groupDataByName,
    groupMapping: groupMappingData,
    groupMappingByChildId: groupMappingDataByChildId,
    groupMappingByParentId: groupMappingDataByParentId,
    groupMember: groupMemberData,
    groupMemberByGroupId: groupMemberDataByGroupId,
    groupMemberByEmployeeId: groupMemberDataByEmployeeId,
    groupAllDetails: groupAllDetails,
    adminIndex: adminIndexData,
  } as iInitialState,
  reducers: {
    addNewGroup: (state, actions: PayloadAction<iGroupAllDetails>) => {
      const id = actions.payload.id;
      const children = actions.payload.children;
      const members = actions.payload.members;
      const groupDetails = { ...actions.payload } as Partial<iGroupAllDetails>;
      delete groupDetails.children;
      delete groupDetails.members;

      state.groupAllDetails[id] = actions.payload;
      state.group[id] = groupDetails as iGroupData;
      state.groupByName[actions.payload.name.toLowerCase()] = id;

      const childGroupIds: number[] = [];
      children?.forEach((data) => {
        state.groupMapping[data.id] = data;
        state.groupMappingByChildId[data.child_group_id] = data.id;
        childGroupIds?.push(data.id);
      });
      state.groupMappingByParentId[id] = childGroupIds;

      const childEmployeeIds: number[] = [];
      members?.forEach((data) => {
        state.groupMember[data.id] = data;
        childEmployeeIds.push(data.employee_id);
      });
      state.groupMemberByGroupId[id] = childEmployeeIds;
      if (actions.payload.admin) {
        if (state.adminIndex[actions.payload.admin]) {
          state.adminIndex[actions.payload.admin].push(id);
        } else state.adminIndex[actions.payload.admin] = [id];
      }
      members.forEach((member) => {
        if (state.groupMemberByEmployeeId[member.employee_id]) {
          state.groupMemberByEmployeeId[member.employee_id].push(member.id);
        } else {
          state.groupMemberByEmployeeId[member.employee_id] = [member.id];
        }
      });
    },
    editGroup: (state, actions: PayloadAction<iGroupAllDetails>) => {
      const id = actions.payload.id;
      const previouseName = state.group[id].name;
      const children = actions.payload.children;
      const members = actions.payload.members;
      const groupDetails = { ...actions.payload } as Partial<iGroupAllDetails>;
      delete groupDetails.children;
      delete groupDetails.members;

      state.groupAllDetails[id] = actions.payload;

      state.group[id] = groupDetails as iGroupData;
      if (previouseName !== actions.payload.name) {
        delete state.groupByName[previouseName.toLowerCase()];
        state.groupByName[actions.payload.name.toLowerCase()] = id;
      }

      state.groupMappingByParentId[id]?.forEach((groupMappingId) => {
        delete state.groupMappingByChildId[
          state.groupMapping[groupMappingId]?.child_group_id
        ];
        delete state.groupMapping[groupMappingId];
      });
      const childGroupIds: number[] = [];
      children?.forEach((data) => {
        state.groupMapping[data.id] = data;
        state.groupMappingByChildId[data.child_group_id] = data.id;
        childGroupIds?.push(data.id);
      });
      state.groupMappingByParentId[id] = childGroupIds;

      state.groupMemberByGroupId[id]?.forEach(
        (groupMemberId) => delete state.groupMember[groupMemberId]
      );
      delete state.groupMemberByGroupId[id];

      const childEmployeeIds: number[] = [];
      members?.forEach((data) => {
        state.groupMember[data.id] = data;
        childEmployeeIds.push(data.employee_id);
      });
      state.groupMemberByGroupId[id] = childEmployeeIds;
      const newGroupMemberByEmployeeId: Record<number, number[]> = {};
      state.adminIndex = Object.values(state.groupAllDetails).reduce<
        Record<number, number[]>
      >((newAdminIndex, group) => {
        if (group.admin) {
          group.members.forEach((member) => {
            if (newGroupMemberByEmployeeId[member.employee_id]) {
              newGroupMemberByEmployeeId[member.employee_id].push(member.id);
            } else {
              newGroupMemberByEmployeeId[member.employee_id] = [member.id];
            }
          });
          if (newAdminIndex[group.admin]) {
            newAdminIndex[group.admin].push(group.id);
            return newAdminIndex;
          } else {
            newAdminIndex[group.admin] = [group.id];
            return newAdminIndex;
          }
        } else {
          return newAdminIndex;
        }
      }, {});
      state.groupMemberByEmployeeId = newGroupMemberByEmployeeId;
    },
    deleteGroup: (state, actions: PayloadAction<iGroupAllDetails>) => {
      const id = actions.payload.id;
      delete state.groupAllDetails[id];
      delete state.group[id];
      delete state.groupByName[actions.payload.name.toLowerCase()];

      if (actions.payload.admin) {
        const newValueForAdminIndex = state.adminIndex[
          actions.payload.admin
        ]?.filter((num) => num !== id);
        if (newValueForAdminIndex.length === 0)
          delete state.adminIndex[actions.payload.admin];
        else state.adminIndex[actions.payload.admin] = newValueForAdminIndex;
      }
      actions.payload.members?.forEach((member) => {
        if (state.groupMemberByEmployeeId[member.employee_id]) {
          const newValue = state.groupMemberByEmployeeId[
            member.employee_id
          ].filter((num) => num !== member.id);
          if (newValue.length === 0)
            delete state.groupMemberByEmployeeId[member.employee_id];
          else {
            state.groupMemberByEmployeeId[member.employee_id] = newValue;
          }
        }
      });

      state.groupMemberByGroupId[id]?.forEach(
        (groupMemberId) => delete state.groupMember[groupMemberId]
      );
      delete state.groupMemberByGroupId[id];

      state.groupMappingByParentId[id]?.forEach((groupMappingId) => {
        delete state.groupMappingByChildId?.[
          state.groupMapping[groupMappingId].child_group_id
        ];
        delete state.groupMapping[groupMappingId];
      });
      const parentGroupId =
        state.groupMapping?.[state.groupMappingByChildId[id]]?.parent_group_id;
      if (parentGroupId) {
        state.groupAllDetails[parentGroupId].children = state.groupAllDetails[
          parentGroupId
        ].children?.filter((child) => child.child_group_id !== id);
      }
      delete state.groupMappingByChildId[id];
      if (state.groupMappingByParentId[parentGroupId]?.length === 1) {
        delete state.groupMappingByParentId[parentGroupId];
      } else {
        state.groupMappingByParentId[parentGroupId] =
          state.groupMappingByParentId[parentGroupId]?.filter(
            (groupMappingId) =>
              groupMappingId !== state.groupMappingByChildId[id]
          );
      }
      delete state.groupMapping[state.groupMappingByChildId[id]];
    },
    updateOnEmployeeDelete: (
      state,
      actions: PayloadAction<iUpdateOnEmployeeDeleteAction>
    ) => {
      state.adminIndex?.[actions.payload.id]?.forEach(
        (id) => (state.groupAllDetails[id].admin = undefined)
      );
      delete state.adminIndex[actions.payload.id];

      state.groupMemberByEmployeeId?.[actions.payload.id]?.forEach(
        (memberId) => {
          const memberObj = state.groupMember[memberId];
          state.groupAllDetails[memberObj.group_id].members =
            state.groupAllDetails[memberObj.group_id]?.members?.filter(
              (member) => member.employee_id !== actions.payload.id
            ) ?? [];

          const newValue = state.groupMemberByGroupId?.[
            memberObj.group_id
          ]?.filter((id) => id !== memberId);

          if (newValue.length === 0)
            delete state.groupMemberByGroupId[memberObj.group_id];
          else state.groupMemberByGroupId[memberObj.group_id] = newValue;
          delete state.groupMember[memberId];
        }
      );
      delete state.groupMemberByEmployeeId?.[actions.payload.id];
    },
  },
});
export const { addNewGroup, editGroup, deleteGroup, updateOnEmployeeDelete } =
  GroupSlice.actions;
export const selectAllGroupAllDetails = (state: RootState) =>
  Object.values(state.group.groupAllDetails);
export const selectAllGroupAllDetailsById = (state: RootState) =>
  state.group.groupAllDetails;
export const selectAllAdminIndex = (state: RootState) => state.group.adminIndex;
export const selectAllGroupMemberByEmployeeId = (state: RootState) =>
  state.group.groupMemberByEmployeeId;
export const selectAllGroupMember = (state: RootState) =>
  state.group.groupMember;
export default GroupSlice.reducer;
