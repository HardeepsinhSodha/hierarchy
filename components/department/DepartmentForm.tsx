import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-daisyui';
import { useAppDispatch } from '../../hooks/store/utilityHooks';
import type { iDepartment } from '../../types/department';
import FormController from '../form_field/FormController';
import { addNewDepartmentAPI, editDepartmentAPI } from './actions';
import { controller as S, schema } from './controller';
interface iEmployeeFormprops {
  show: boolean;
  handleClose(): void;
  data?: iDepartment;
}

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
    initialValues: S.initialValues,
    onSubmit: onSubmit,
    validationSchema: schema,
  });
  useEffect(() => {
    if (data) {
      formik.setFieldValue(S.formField.name.id, data.name);
      setErrorMessage('');
    }
    return () => {
      setErrorMessage('');
      formik.resetForm();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  return (
    <Modal className="w-6/12 max-w-5xl" open={show}>
      <button
        className="btn btn-circle btn-sm absolute right-2 top-2"
        onClick={handleClose}
      >
        ✕
      </button>
      <Modal.Header className="font-bold">{S.modalHeading}</Modal.Header>
      <Modal.Body>
        <form
          id={S.formId}
          onSubmit={formik.handleSubmit}
          className="text-left"
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
