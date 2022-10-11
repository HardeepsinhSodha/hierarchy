import * as Yup from 'yup';
import { iFormController } from '../../types/formControler';
export const controller = {
  modalHeading: 'Employee Details',
  formField: {
    name: {
      id: 'name',
      name: 'name',
      label: 'Full Name',
      controller: 'input' as iFormController,
    },
    username: {
      id: 'username',
      name: 'username',
      label: 'Display/User Name',
      controller: 'input' as iFormController,
    },
    email_id: {
      id: 'email_id',
      name: 'email_id',
      label: 'Email Id',
      controller: 'input' as iFormController,
      type: 'email',
    },
    phone_number: {
      id: 'phone_number',
      name: 'phone_number',
      label: 'Phone Number',
      controller: 'input' as iFormController,
    },
    department: {
      id: 'department',
      name: 'department',
      label: 'Department',
      controller: 'select' as iFormController,
    },
  },
  formId: 'employeeForm',
  submitBtn: 'Submit',
  updateBtn: 'Update',
  closeBtn: 'Colse',
  yupError: {
    email_id: 'Email Id is not valid.',
    required: 'Required',
    phone_number_matchs: 'Phone number is not valid',
    phone_number_length: 'It can not have more than 10 digits',
  },
  action: {
    error: {
      nameDuplication: 'Name is already registered',
      usernameDuplication: 'Username is already taken',
      phoneNoDuplication: 'Phone no is already taken',
      emailIdDuplication: 'Email id is already taken',
      employeeNotFound: 'Employee Not Found',
    },
    success: {
      added: (name: string) => `${name} is added successfully`,
      edited: (name: string) => `${name}'s info is updated successfully`,
      deleted: (name: string) => `${name} is removed successfully`,
    },
  },
  initialValues: {
    name: '',
    username: '',
    email_id: '',
    phone_number: '',
    department: undefined,
  },
};
const phoneRegExp = /\d{10}/i;
const requiredString = controller.yupError.required;
export const schema = Yup.object().shape({
  name: Yup.string().trim().required(requiredString),
  username: Yup.string().trim().required(requiredString),
  email_id: Yup.string()
    .trim()
    .lowercase()
    .email(controller.yupError.email_id)
    .required(requiredString),
  phone_number: Yup.string()
    .matches(phoneRegExp, controller.yupError.phone_number_matchs)
    .length(10, controller.yupError.phone_number_length)
    .required(requiredString),
});
