import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-daisyui';
import Select from 'react-select';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../hooks/store/utilityHooks';
import { iDepartment } from '../../types/department';
import type iEmployee from '../../types/employee';
import {
  selectAllDepartment,
  selectAllDepartmentById,
} from '../department/departmentSlice';
import FieldWraper from '../form_field/FieldWrapper';
import FormController from '../form_field/FormController';
import { addNewEmployeeAPI, editEmployeeAPI } from './actions';
const phoneRegExp = /\d{10}/i;

interface iEmployeeFormprops {
  show: boolean;
  handleClose(): void;
  data?: iEmployee;
}
interface iEmployeeFormInput extends Omit<iEmployee, 'id' | 'department'> {
  department?: iDepartment;
}
const schema = Yup.object().shape({
  name: Yup.string().trim().required('Required'),
  username: Yup.string().trim().required('Required'),
  email_id: Yup.string()
    .trim()
    .lowercase()
    .email('Email Id is not valid.')
    .required('Required'),
  phone_number: Yup.string()
    .matches(phoneRegExp, 'Phone number is not valid')
    .length(10, 'Phone number is not valid'),
});
// department: Yup.string().required('Required'),
export default function EmployeeForm(props: iEmployeeFormprops) {
  const { show, handleClose, data } = props;
  const departmentOptions = useAppSelector(selectAllDepartment);
  const departmentOptionsById = useAppSelector(selectAllDepartmentById);
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  const onSubmit = (values: iEmployeeFormInput) => {
    const department: number = values.department?.id as number;
    if (data) {
      dispatch(
        editEmployeeAPI(
          { ...values, id: data?.id, department },
          handleClose,
          (message) => setErrorMessage(message)
        )
      );
    } else {
      dispatch(
        addNewEmployeeAPI({ ...values, department }, handleClose, (message) =>
          setErrorMessage(message)
        )
      );
    }
  };
  const formik = useFormik<iEmployeeFormInput>({
    initialValues: {
      name: '',
      username: '',
      email_id: '',
      phone_number: '',
      department: undefined,
    },
    onSubmit: onSubmit,
    validationSchema: schema,
  });
  useEffect(() => {
    if (data) {
      formik.setFieldValue('name', data.name);
      formik.setFieldValue('username', data.username);
      formik.setFieldValue('email_id', data.email_id);
      formik.setFieldValue('phone_number', data.phone_number);
      formik.setFieldValue(
        'department',
        departmentOptionsById[data.department]
      );
      setErrorMessage('');
    }
    return () => {
      setErrorMessage('');
      formik.resetForm();
    };
  }, [data, departmentOptionsById, formik, show]);

  return (
    <Modal
      className="w-6/12 max-w-5xl"
      open={show}
      onClickBackdrop={handleClose}
    >
      <Button
        size="sm"
        shape="circle"
        className="absolute right-2 top-2"
        onClick={handleClose}
      >
        ✕
      </Button>
      <Modal.Header className="font-bold">Employee Details</Modal.Header>
      <Modal.Body>
        <p className="text-error">{errorMessage}</p>
        <form
          id="employeeForm"
          onSubmit={formik.handleSubmit}
          className="text-left grid grid-col-1 sm:grid-cols-2"
        >
          <FormController
            controller="input"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Full Name"
            error={formik.touched.name && formik.errors?.name}
            autoFocus={true}
          />
          <FormController
            controller="input"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Display/User Name"
            error={formik.touched.username && formik.errors?.username}
          />
          <FormController
            controller="input"
            name="email_id"
            type="email"
            value={formik.values.email_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Email"
            error={formik.touched.email_id && formik.errors?.email_id}
          />
          <FormController
            controller="input"
            name="phone_number"
            value={formik.values.phone_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Phone Number"
            error={formik.touched.phone_number && formik.errors?.phone_number}
          />
          <FieldWraper
            controller="select"
            name="department"
            label="Department"
            error={formik.touched.department && formik.errors?.department}
          >
            <Select
              name="department"
              value={formik.values.department}
              onChange={(value: any) =>
                formik.setFieldValue('department', value)
              }
              onBlur={formik.handleBlur}
              getOptionValue={(options) => options.id.toString()}
              getOptionLabel={(options) => options.name}
              options={departmentOptions ?? []}
              menuPlacement="top"
            />
          </FieldWraper>
        </form>
        <div className="flex justify-end gap-4 my-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="btn btn-primary"
          >
            Close
          </Button>
          <Button form="employeeForm" type="submit" className="btn btn-primary">
            {data ? 'Update' : 'Submit'}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
