import {
  iGroupAllDetails,
  iGroupData,
  iGroupMapping,
  iGroupMemberData,
} from '../types/group';

export const groupData: Record<number, iGroupData> = {
  1: {
    id: 1,
    name: 'CEO',
    title: '',
    removable: false,
    admin: 1,
    allowedDepartments: [],
    canHaveSubGroup: true,
    canHaveMembers: true,
    updated_by: 1,
    upadted_on: '04/10/2022',
    created_by: 1,
    created_on: '04/10/2022',
  },
  2: {
    id: 2,
    name: 'Head Of Akatsuki',
    title: '',
    admin: 2,
    allowedDepartments: [1],
    removable: true,
    canHaveSubGroup: false,
    canHaveMembers: true,
    updated_by: 1,
    upadted_on: '04/10/2022',
    created_by: 1,
    created_on: '04/10/2022',
  },
  3: {
    id: 3,
    name: 'Hidden leaf',
    title: 'Hokage',
    admin: 5,
    allowedDepartments: [1, 2],
    removable: true,
    canHaveSubGroup: true,
    canHaveMembers: true,
    updated_by: 1,
    upadted_on: '04/10/2022',
    created_by: 1,
    created_on: '04/10/2022',
  },
  4: {
    id: 4,
    name: 'Team 7',
    title: 'Team Lead',
    admin: 6,
    allowedDepartments: [1, 2],
    removable: true,
    canHaveSubGroup: false,
    canHaveMembers: true,
    updated_by: 1,
    upadted_on: '04/10/2022',
    created_by: 1,
    created_on: '04/10/2022',
  },
};
export const groupDataByName: Record<string, number> = {
  ceo: 1,
  'head of akatsuki': 2,
  'hidden leaf': 3,
  'team 7': 4,
};
export const groupMappingData: Record<number, iGroupMapping> = {
  1: {
    id: 1,
    parent_group_id: 1,
    child_group_id: 2,
  },
  2: {
    id: 2,
    parent_group_id: 1,
    child_group_id: 3,
  },
  3: {
    id: 3,
    parent_group_id: 3,
    child_group_id: 4,
  },
};
export const groupMappingDataByChildId: Record<number, number> = {
  2: 1,
  3: 2,
  4: 3,
};
export const groupMappingDataByParentId: Record<number, number[]> = {
  1: [1, 2],
  3: [3],
};
export const groupMemberData: Record<number, iGroupMemberData> = {
  1: {
    id: 1,
    group_id: 2,
    employee_id: 3,
    title: '',
    joining_date: '03/10/2022',
    left_data: undefined,
  },
  2: {
    id: 2,
    group_id: 2,
    employee_id: 4,
    title: '',
    joining_date: '03/10/2022',
    left_data: undefined,
  },
  3: {
    id: 3,
    group_id: 3,
    employee_id: 3,
    title: 'Backend Lead',
    joining_date: '03/10/2022',
    left_data: undefined,
  },
  4: {
    id: 4,
    group_id: 4,
    employee_id: 7,
    title: '',
    joining_date: '03/10/2022',
    left_data: undefined,
  },
  5: {
    id: 5,
    group_id: 4,
    employee_id: 8,
    title: '',
    joining_date: '03/10/2022',
    left_data: undefined,
  },
};
export const groupMemberDataByGroupId: Record<number, number[]> = {
  2: [1, 2],
  3: [3],
  4: [4, 5],
};
export const groupAllDetails: Record<number, iGroupAllDetails> = {
  1: {
    id: 1,
    name: 'CEO',
    title: '',
    removable: false,
    admin: 1,
    allowedDepartments: [],
    canHaveSubGroup: true,
    canHaveMembers: true,
    updated_by: 1,
    upadted_on: '04/10/2022',
    created_by: 1,
    created_on: '04/10/2022',
    children: [
      {
        id: 1,
        parent_group_id: 1,
        child_group_id: 2,
      },
      {
        id: 2,
        parent_group_id: 1,
        child_group_id: 3,
      },
    ],
    members: [],
  },
  2: {
    id: 2,
    name: 'Head Of Akatsuki',
    title: '',
    admin: 2,
    allowedDepartments: [1],
    removable: true,
    canHaveSubGroup: false,
    canHaveMembers: true,
    updated_by: 1,
    upadted_on: '04/10/2022',
    created_by: 1,
    created_on: '04/10/2022',
    children: [],
    members: [
      {
        id: 1,
        group_id: 2,
        employee_id: 3,
        title: '',
        joining_date: '03/10/2022',
        left_data: undefined,
      },
      {
        id: 2,
        group_id: 2,
        employee_id: 4,
        title: '',
        joining_date: '03/10/2022',
        left_data: undefined,
      },
    ],
  },
  3: {
    id: 3,
    name: 'Hidden leaf',
    title: 'Hokage',
    admin: 5,
    allowedDepartments: [1, 2],
    removable: true,
    canHaveSubGroup: true,
    canHaveMembers: true,
    updated_by: 1,
    upadted_on: '04/10/2022',
    created_by: 1,
    created_on: '04/10/2022',
    children: [
      {
        id: 3,
        parent_group_id: 3,
        child_group_id: 4,
      },
    ],
    members: [
      {
        id: 3,
        group_id: 3,
        employee_id: 3,
        title: 'Backend Lead',
        joining_date: '03/10/2022',
        left_data: undefined,
      },
    ],
  },
  4: {
    id: 4,
    name: 'Team 7',
    title: 'Team Lead',
    admin: 6,
    allowedDepartments: [1, 2],
    removable: true,
    canHaveSubGroup: false,
    canHaveMembers: true,
    updated_by: 1,
    upadted_on: '04/10/2022',
    created_by: 1,
    created_on: '04/10/2022',
    children: [],
    members: [
      {
        id: 4,
        group_id: 4,
        employee_id: 7,
        title: '',
        joining_date: '03/10/2022',
        left_data: undefined,
      },
      {
        id: 5,
        group_id: 4,
        employee_id: 8,
        title: '',
        joining_date: '03/10/2022',
        left_data: undefined,
      },
    ],
  },
};
