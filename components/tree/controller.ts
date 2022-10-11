import { iFormController } from '../../types/formControler';
export const controller = {
  modalHeading: 'Department Details',
  formField: {
    employee: {
      id: 'employee',
      name: 'employee',
      label: 'Employee',
      controller: 'select' as iFormController,
      placeholder: 'Search by name/email/PhoneNo',
    },
    group: {
      id: 'group',
      name: 'group',
      label: 'Group',
      controller: 'select' as iFormController,
    },
  },
  expandAll: 'Expand All',
  collapseAll: 'Collapse All',
  addEmployee: 'Add Employee',
  createGroup: 'Collapse All',
  editEmployeeDetails: 'editEmployeeDetails',
  action: {
    error: {},
    success: {},
  },
};
