export default interface iEmployee {
  id: number;
  name: string;
  username: string;
  phone_number: string;
  email_id: string;
  department: number;
}
export interface iHandleEpmloyeeAction {
  (type: 'edit' | 'delete' | 'add', data?: iEmployee): void;
}
export type iSelectedEmployeeOption = iEmployee | null | undefined;
