import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import {
  groupAllDetails,
  groupData,
  groupDataByName,
  groupMappingData,
  groupMappingDataByChildId,
  groupMappingDataByParentId,
  groupMemberData,
  groupMemberDataByGroupId,
} from '../../data/group';
import { RootState } from '../../store/store';
import type {
  iGroupAllDetails,
  iGroupData,
  iGroupMapping,
  iGroupMemberData,
} from '../../types/group';
interface iInitialState {
  group: Record<number, iGroupData>;
  groupByName: Record<string, number>;
  groupMapping: Record<number, iGroupMapping>;
  groupMappingByChildId: Record<number, number>;
  groupMappingByParentId: Record<number, number[]>;
  groupMember: Record<number, iGroupMemberData>;
  groupMemberByGroupId: Record<number, number[]>;
  groupAllDetails: Record<number, iGroupAllDetails>;
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
    groupAllDetails: groupAllDetails,
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
    },
    editGroup: (state, actions: PayloadAction<iGroupAllDetails>) => {
      const id = actions.payload.id;
      const previouseGroupName = state.group[id].name;
      const children = actions.payload.children;
      const members = actions.payload.members;
      const groupDetails = { ...actions.payload } as Partial<iGroupAllDetails>;
      delete groupDetails.children;
      delete groupDetails.members;

      state.groupAllDetails[id] = actions.payload;

      state.group[id] = groupDetails as iGroupData;
      if (previouseGroupName !== actions.payload.name) {
        delete state.groupByName[previouseGroupName.toLowerCase()];
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
    },
    deleteGroup: (state, actions: PayloadAction<iGroupAllDetails>) => {
      const id = actions.payload.id;
      delete state.groupAllDetails[id];
      delete state.group[id];
      delete state.groupByName[actions.payload.name.toLowerCase()];

      state.groupMemberByGroupId[id]?.forEach(
        (groupMemberId) => delete state.groupMember[groupMemberId]
      );
      delete state.groupMemberByGroupId[id];

      state.groupMappingByParentId[id]?.forEach((groupMappingId) => {
        delete state.groupMappingByChildId[
          state.groupMapping[groupMappingId].child_group_id
        ];
        delete state.groupMapping[groupMappingId];
      });
      const parentGroupId =
        state.groupMapping[state.groupMappingByChildId[id]].parent_group_id;
      state.groupAllDetails[parentGroupId].children = state.groupAllDetails[
        parentGroupId
      ].children?.filter((child) => child.child_group_id !== id);
      delete state.groupMappingByChildId[id];
      if (state.groupMappingByParentId[parentGroupId]?.length === 1) {
        delete state.groupMappingByParentId[parentGroupId];
      } else {
        state.groupMappingByParentId[parentGroupId] =
          state.groupMappingByParentId[parentGroupId].filter(
            (groupMappingId) =>
              groupMappingId !== state.groupMappingByChildId[id]
          );
      }
      delete state.groupMapping[state.groupMappingByChildId[id]];
    },
  },
});
export const { addNewGroup, editGroup, deleteGroup } = GroupSlice.actions;
export const selectAllGroupAllDetails = (state: RootState) =>
  Object.values(state.group.groupAllDetails);
export const selectAllGroupAllDetailsById = (state: RootState) =>
  state.group.groupAllDetails;

export default GroupSlice.reducer;
