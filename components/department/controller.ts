import * as Yup from 'yup';
import { iFormController } from '../../types/formControler';
export const controller = {
  modalHeading: 'Department Details',
  formField: {
    name: {
      id: 'name',
      name: 'name',
      label: 'Department Name',
      controller: 'input' as iFormController,
    },
  },
  formId: 'departmentForm',
  submitBtn: 'Submit',
  updateBtn: 'Update',
  closeBtn: 'Colse',
  yupError: {
    required: 'Required',
  },
  action: {
    error: {
      nameDuplication: 'Department name is already exist',
      departmentNotFound: 'Department Not Found',
      employeeFound: (names: string) =>
        `This department is used in Employee: ${names}, Remove from there first.`,
      groupFound: (names: string) =>
        `This department is used in Group: ${names}, Remove from there first.`,
    },
    success: {
      added: (name: string) => `${name} is added successfully`,
      edited: (name: string) => `${name}'s info is updated successfully`,
      deleted: (name: string) => `${name} is removed successfully`,
    },
  },
  initialValues: {
    name: '',
  },
};
export const schema = Yup.object().shape({
  name: Yup.string().trim().required('Required'),
});
