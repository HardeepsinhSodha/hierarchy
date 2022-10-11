import * as Yup from 'yup';
import { iFormController } from '../../types/formControler';
export const controller = {
  modalHeading: 'Group Details',
  formField: {
    name: {
      id: 'name',
      name: 'name',
      label: 'Group Name',
      controller: 'input' as iFormController,
      autoFocus: true,
    },
    title: {
      id: 'title',
      name: 'title',
      label: 'Title',
      controller: 'input' as iFormController,
    },
    admin: {
      id: 'admin',
      name: 'admin',
      label: 'Head/Admin',
      controller: 'select' as iFormController,
    },
    allowedDepartments: {
      id: 'allowedDepartments',
      name: 'allowedDepartments',
      label: 'Department',
      controller: 'select' as iFormController,
    },
    canHaveSubGroup: {
      id: 'canHaveSubGroup',
      name: 'canHaveSubGroup',
      label: 'Allow to add sub group',
      controller: 'checkbox' as iFormController,
    },
    canHaveMembers: {
      id: 'canHaveMembers',
      name: 'canHaveMembers',
      label: 'Allow to add member',
      controller: 'checkbox' as iFormController,
    },
    children: {
      id: 'children',
      name: 'children',
      label: 'Sub Group',
      controller: 'select' as iFormController,
    },
    members: {
      id: 'members',
      name: 'members',
      label: 'Members',
      controller: 'select' as iFormController,
    },
    removable: {
      id: 'removable',
      name: 'removable',
      label: 'Yes,You can remove this group.',
      controller: 'checkbox' as iFormController,
    },
  },
  formId: 'groupForm',
  submitBtn: 'Submit',
  updateBtn: 'Update',
  closeBtn: 'Colse',
  yupError: {
    required: 'Required',
  },
  action: {
    error: {
      nameDuplication: 'Group Name name is already exist',
      recursive: (name: string) =>
        `Group ${name} is recursive, remove it and try again.`,
      employeeFound: (names: string) =>
        `This department is used in Employee: ${names}, Remove from there first.`,
      groupNotFound: 'Group not Found',
      canNotRemove: (name: string) =>
        `Group :${name} can not be removed this group.`,
    },
    success: {
      added: (name: string) => `Group :${name} is added successfully`,
      edited: (name: string) =>
        `Group : ${name}'s info is updated successfully`,
      deleted: (name: string) => `Group :${name} is removed successfully`,
      promoted: 'Promoted successfully',
      noPlaceToPromote: 'There is no place to promote you. :)',
    },
  },
  initialValues: {
    name: '',
    admin: undefined,
    title: '',
    canHaveSubGroup: false,
    canHaveMembers: true,
    allowedDepartments: [],
    removable: true,
    children: [],
    members: [],
  },
};
export const schema = Yup.object().shape({
  name: Yup.string().trim().required(controller.yupError.required),
  title: Yup.string().trim(),
  canHaveSubGroup: Yup.bool(),
  canHaveMembers: Yup.bool(),
  removable: Yup.bool(),
});
