import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-daisyui';
import * as Yup from 'yup';
import { useAppDispatch } from '../../hooks/store/utilityHooks';
import type { iDepartment } from '../../types/department';
import FormController from '../form_field/FormController';
import { addNewDepartmentAPI, editDepartmentAPI } from './actions';
interface iEmployeeFormprops {
  show: boolean;
  handleClose(): void;
  data?: iDepartment;
}

const schema = Yup.object().shape({
  name: Yup.string().trim().required('Required'),
});
export default function EmployeeForm(props: iEmployeeFormprops) {
  const { show, handleClose, data } = props;
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  const onSubmit = (values: Omit<iDepartment, 'id'>) => {
    if (data) {
      dispatch(
        editDepartmentAPI({ ...values, id: data?.id }, handleClose, (message) =>
          setErrorMessage(message)
        )
      );
    } else {
      dispatch(
        addNewDepartmentAPI(values, handleClose, (message) =>
          setErrorMessage(message)
        )
      );
    }
  };
  const formik = useFormik<Omit<iDepartment, 'id'>>({
    initialValues: {
      name: '',
    },
    onSubmit: onSubmit,
    validationSchema: schema,
  });
  useEffect(() => {
    if (data) {
      formik.setFieldValue('name', data.name);
      setErrorMessage('');
    }
    return () => {
      setErrorMessage('');
      formik.resetForm();
    };
  }, [show]);

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
      <Modal.Header className="font-bold">Department Details</Modal.Header>
      <Modal.Body>
        <p className="text-error">{errorMessage}</p>
        <form
          id="employeeForm"
          onSubmit={formik.handleSubmit}
          className="text-left"
        >
          <FormController
            controller="input"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Department Name"
            error={formik.touched.name && formik.errors?.name}
            autoFocus={true}
          />
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
