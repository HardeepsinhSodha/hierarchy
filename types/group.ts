import iEmployee from './employee';
export interface iGroupAllDetails extends iGroupData {
  children: iGroupMapping[];
  members: iGroupMemberData[];
}
export interface iGroup extends Omit<iGroupData, 'admin'> {
  admin: iEmployee;
}
export interface iGroupData {
  id: number;
  name: string;
  admin: number;
  title?: string;
  canHaveSubGroup: boolean;
  canHaveMembers: boolean;
  allowedDepartments: number[];
  removable: boolean;
  updated_by?: number;
  upadted_on?: string;
  created_by?: number;
  created_on?: string;
}
export interface iGroupMapping {
  id: number;
  parent_group_id: number;
  child_group_id: number;
}
export interface iGroupMember extends iGroupMemberData, Omit<iEmployee, 'id'> {}
export interface iGroupMemberData {
  id: number;
  group_id: number;
  employee_id: number;
  title?: string;
  joining_date?: string;
  left_data?: string;
}
