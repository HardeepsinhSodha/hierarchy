import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Modal } from 'react-daisyui';
import Select, { MultiValue, SingleValue } from 'react-select';
import { useAppDispatch, useAppSelector } from '../../hooks/store/utilityHooks';
import { iDepartment } from '../../types/department';
import iEmployee from '../../types/employee';
import { iGroupAllDetails, iGroupData } from '../../types/group';
import {
  selectAllDepartment,
  selectAllDepartmentById,
} from '../department/departmentSlice';
import {
  selectAllEmployee,
  selectAllEmployeeById,
} from '../employee/employeeSlice';
import FieldWraper from '../form_field/FieldWrapper';
import FormController from '../form_field/FormController';
import { addNewGroupAllDetailsAPI, editGroupAllDetailsAPI } from './actions';
import { controller as S, schema } from './controller';
import {
  selectAllGroupAllDetails,
  selectAllGroupAllDetailsById,
} from './groupInfoSlice';
interface iEmployeeFormprops {
  show: boolean;
  handleClose(): void;
  data?: iGroupAllDetails;
}
export interface iGroupAllDetailsInput
  extends Omit<iGroupData, 'id' | 'admin' | 'allowedDepartments'> {
  admin?: iEmployee;
  allowedDepartments?: iDepartment[];
  children?: iGroupAllDetails[];
  members?: iEmployee[];
}

export default function GroupAllDetailsForm(props: iEmployeeFormprops) {
  const { show, handleClose, data } = props;
  const groupAllDetailsOption = useAppSelector(selectAllGroupAllDetails);
  const groupAllDetailsBy = useAppSelector(selectAllGroupAllDetailsById);
  const departmentOptionsById = useAppSelector(selectAllDepartmentById);
  const departmentOptions = useAppSelector(selectAllDepartment);
  const selectEmployeeById = useAppSelector(selectAllEmployeeById);
  const selectEmployeeOptions = useAppSelector(selectAllEmployee);
  const dispatch = useAppDispatch();
  const [errorMessage, setErrorMessage] = useState('');
  const [allowedEmployeeOptions, setAllowdEmployeeOptions] = useState<
    iEmployee[] | undefined
  >();
  const onSubmit = (values: iGroupAllDetailsInput) => {
    if (data) {
      dispatch(
        editGroupAllDetailsAPI(
          { ...values, id: data?.id },
          handleClose,
          (message) => setErrorMessage(message)
        )
      );
    } else {
      dispatch(
        addNewGroupAllDetailsAPI(values, handleClose, (message) =>
          setErrorMessage(message)
        )
      );
    }
  };
  const formik = useFormik<iGroupAllDetailsInput>({
    initialValues: S.initialValues,
    onSubmit: onSubmit,
    validationSchema: schema,
  });
  const handleCanHaveMemebers = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue(S.formField.canHaveMembers.name, e.target.checked);
    if (!e.target.checked) {
      formik.setFieldValue(S.formField.members.name, null);
    }
  };
  const handleCanHaveSubGroup = (e: React.ChangeEvent<HTMLInputElement>) => {
    formik.setFieldValue(S.formField.canHaveSubGroup.name, e.target.checked);
    if (!e.target.checked) {
      formik.setFieldValue(S.formField.children.name, null);
    }
  };
  const handleAllowedDepartments = (options: MultiValue<iDepartment>) => {
    formik.setFieldValue(S.formField.allowedDepartments.name, options);
    if (options) {
      const departmentsIds = options?.reduce<Record<number, number>>(
        (newDepartmentObj, department) => {
          newDepartmentObj[department.id] = department.id;
          return newDepartmentObj;
        },
        {}
      );
      setAllowdEmployeeOptions(
        selectEmployeeOptions.filter(
          (employee) => departmentsIds?.[employee.department]
        )
      );
      formik.setFieldValue(
        S.formField.members.name,
        formik.values.members?.filter(
          (member) => departmentsIds?.[member.department]
        )
      );
    }
  };
  useEffect(() => {
    if (data) {
      formik.setFieldValue(S.formField.name.name, data.name);
      formik.setFieldValue(
        S.formField.admin.name,
        data?.admin ? selectEmployeeById[data.admin] : null
      );
      formik.setFieldValue(S.formField.title.name, data.title);
      formik.setFieldValue(
        S.formField.canHaveSubGroup.name,
        data.canHaveSubGroup
      );
      formik.setFieldValue(
        S.formField.canHaveMembers.name,
        data.canHaveMembers
      );
      formik.setFieldValue(S.formField.removable.name, data.removable);
      formik.setFieldValue(
        S.formField.allowedDepartments.name,
        data.allowedDepartments.map(
          (department) => departmentOptionsById[department]
        )
      );
      formik.setFieldValue(
        S.formField.children.name,
        data.children.map((child) => groupAllDetailsBy[child.child_group_id])
      );
      formik.setFieldValue(
        S.formField.members.name,
        data.members.map((child) => selectEmployeeById[child.employee_id])
      );
      setAllowdEmployeeOptions(
        selectEmployeeOptions.filter((employee) =>
          data.allowedDepartments?.includes(employee.department)
        )
      );
      setErrorMessage('');
    }
    return () => {
      setErrorMessage('');
      formik.resetForm();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    data,
    departmentOptionsById,
    groupAllDetailsBy,
    selectEmployeeById,
    show,
  ]);

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
          className="text-left grid grid-col-1 lg:grid-cols-2"
        >
          <p className="text-error col-span-1 lg:col-span-2">{errorMessage}</p>
          <FormController
            {...S.formField.name}
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.name && formik.errors?.name}
          />
          <FormController
            {...S.formField.title}
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <FieldWraper {...S.formField.admin}>
            <Select
              id={S.formField.admin.id}
              name={S.formField.admin.name}
              value={formik.values.admin}
              onChange={(value: SingleValue<iEmployee>) =>
                formik.setFieldValue(S.formField.admin.name, value)
              }
              onBlur={formik.handleBlur}
              getOptionValue={(options) => options.id.toString()}
              getOptionLabel={(options) => options.name}
              options={selectEmployeeOptions}
            />
          </FieldWraper>
          <FieldWraper {...S.formField.allowedDepartments}>
            <Select
              id={S.formField.allowedDepartments.id}
              name={S.formField.allowedDepartments.name}
              value={formik.values.allowedDepartments}
              onChange={handleAllowedDepartments}
              isMulti={true}
              onBlur={formik.handleBlur}
              getOptionValue={(options) => options.id.toString()}
              getOptionLabel={(options) => options.name}
              options={departmentOptions}
            />
          </FieldWraper>
          <FormController
            {...S.formField.canHaveSubGroup}
            value={formik.values.canHaveSubGroup}
            onChange={handleCanHaveSubGroup}
            onBlur={formik.handleBlur}
          />
          <FormController
            {...S.formField.canHaveMembers}
            value={formik.values.canHaveMembers}
            onChange={handleCanHaveMemebers}
            onBlur={formik.handleBlur}
          />

          <FieldWraper
            {...S.formField.children}
            error={formik.touched.children && formik.errors?.children}
          >
            <Select
              id={S.formField.children.id}
              name={S.formField.children.name}
              isDisabled={!formik.values.canHaveSubGroup}
              value={formik.values.children}
              onChange={(value: MultiValue<iDepartment>) =>
                formik.setFieldValue(S.formField.children.name, value)
              }
              isMulti={true}
              onBlur={formik.handleBlur}
              getOptionValue={(options) => options.id.toString()}
              getOptionLabel={(options) => options.name}
              options={groupAllDetailsOption}
              menuPlacement="top"
            />
          </FieldWraper>

          <FieldWraper
            {...S.formField.members}
            error={formik.touched.members && formik.errors?.members}
          >
            <Select
              id={S.formField.members.id}
              name={S.formField.members.name}
              value={formik.values.members}
              isDisabled={!formik.values.canHaveMembers}
              onChange={(value: MultiValue<iEmployee>) =>
                formik.setFieldValue(S.formField.members.name, value)
              }
              isMulti={true}
              onBlur={formik.handleBlur}
              getOptionValue={(options) => options.id.toString()}
              getOptionLabel={(options) => options.name}
              options={allowedEmployeeOptions}
              menuPlacement="top"
            />
          </FieldWraper>

          <FormController
            {...S.formField.removable}
            value={formik.values.removable}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </form>
        <div className="flex justify-end gap-4 my-4">
          <button onClick={handleClose} className="btn btn-primary btn-outline">
            {S.closeBtn}
          </button>
          <button form={S.formId} type="submit" className="btn btn-primary">
            {data ? S.updateBtn : S.submitBtn}
          </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
