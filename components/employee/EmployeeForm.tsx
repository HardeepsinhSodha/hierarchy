import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-daisyui';
import Select, { SingleValue } from 'react-select';
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
import { controller as S, schema } from './controller';

interface iEmployeeFormprops {
  show: boolean;
  handleClose(): void;
  data?: iEmployee;
}

interface iEmployeeFormInput extends Omit<iEmployee, 'id' | 'department'> {
  department?: iDepartment;
}

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
    initialValues: S.initialValues,
    onSubmit: onSubmit,
    validationSchema: schema,
  });
  useEffect(() => {
    if (data) {
      formik.setFieldValue(S.formField.name.id, data.name);
      formik.setFieldValue(S.formField.username.id, data.username);
      formik.setFieldValue(S.formField.email_id.id, data.email_id);
      formik.setFieldValue(S.formField.phone_number.id, data.phone_number);
      formik.setFieldValue(
        S.formField.department.id,
        departmentOptionsById[data.department]
      );
      setErrorMessage('');
    }
    return () => {
      setErrorMessage('');
      formik.resetForm();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, departmentOptionsById, show]);

  return (
    <Modal className="w-6/12 max-w-5xl" open={show}>
      <button
        className="btn btn-sm btn-circle absolute right-2 top-2"
        onClick={handleClose}
      >
        ✕
      </button>
      <Modal.Header className="font-bold">{S.modalHeading}</Modal.Header>
      <Modal.Body>
        <form
          id={S.formId}
          onSubmit={formik.handleSubmit}
          className="text-left grid grid-col-1 md:grid-cols-2"
        >
          <p className="text-error col-span-1 md:col-span-2">{errorMessage}</p>
          <FormController
            {...S.formField.name}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors?.name}
            autoFocus={true}
          />
          <FormController
            {...S.formField.username}
            value={formik.values.username}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.username && formik.errors?.username}
          />
          <FormController
            {...S.formField.email_id}
            value={formik.values.email_id}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.email_id && formik.errors?.email_id}
          />
          <FormController
            {...S.formField.phone_number}
            value={formik.values.phone_number}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.phone_number && formik.errors?.phone_number}
          />
          <FieldWraper
            {...S.formField.department}
            error={formik.touched.department && formik.errors?.department}
          >
            <Select
              id={S.formField.department.id}
              name={S.formField.department.name}
              value={formik.values.department}
              onChange={(value: SingleValue<iDepartment>) =>
                formik.setFieldValue(S.formField.department.name, value)
              }
              onBlur={formik.handleBlur}
              getOptionValue={(options) => options.id.toString()}
              getOptionLabel={(options) => options.name}
              options={departmentOptions}
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
            {S.closeBtn}
          </Button>
          <Button form={S.formId} type="submit" className="btn btn-primary">
            {data ? S.updateBtn : S.submitBtn}
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
