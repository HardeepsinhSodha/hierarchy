import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { Button, Modal } from 'react-daisyui';
import Select, { MultiValue, SingleValue } from 'react-select';
import * as Yup from 'yup';
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
const schema = Yup.object().shape({
  name: Yup.string().trim().required('Required'),
  title: Yup.string().trim(),
  canHaveSubGroup: Yup.bool(),
  canHaveMembers: Yup.bool(),
  removable: Yup.bool(),
  allowedDepartments: Yup.array(Yup.object()),
  children: Yup.array(Yup.object()),
  members: Yup.array(Yup.object()),
  admin: Yup.object(),
});

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
    onSubmit: onSubmit,
    validationSchema: schema,
  });
  useEffect(() => {
    if (data) {
      formik.setFieldValue('name', data.name);
      formik.setFieldValue('admin', selectEmployeeById[data.admin]);
      formik.setFieldValue('title', data.title);
      formik.setFieldValue('canHaveSubGroup', data.canHaveSubGroup);
      formik.setFieldValue('canHaveMembers', data.canHaveMembers);
      formik.setFieldValue('removable', data.removable);
      formik.setFieldValue(
        'allowedDepartments',
        data.allowedDepartments.map(
          (department) => departmentOptionsById[department]
        )
      );
      formik.setFieldValue(
        'children',
        data.children.map((child) => groupAllDetailsBy[child.child_group_id])
      );
      formik.setFieldValue(
        'members',
        data.members.map((child) => selectEmployeeById[child.employee_id])
      );
      setErrorMessage('');
    }
    return () => {
      setErrorMessage('');
      formik.resetForm();
    };
  }, [
    data,
    departmentOptionsById,
    groupAllDetailsBy,
    selectEmployeeById,
    show,
  ]);
  useEffect(() => {
    if (formik.values.allowedDepartments) {
      const departmentsIds = formik.values.allowedDepartments.map(
        (department) => department.id
      );
      setAllowdEmployeeOptions(
        selectEmployeeOptions.filter((employee) =>
          departmentsIds?.includes(employee.department)
        )
      );
      formik.setFieldValue(
        'members',
        formik.values.members?.filter((member) =>
          departmentsIds?.includes(member.department)
        )
      );
    }
  }, [formik.values.allowedDepartments, selectEmployeeOptions]);
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
      <Modal.Header className="font-bold">Group Details</Modal.Header>
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
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Title"
          />
          <FieldWraper
            controller="select"
            name="admin"
            label="Head/Admin"
            error={formik.touched.admin && formik.errors?.admin}
          >
            <Select
              name="admin"
              value={formik.values.admin}
              onChange={(value: SingleValue<iEmployee>) =>
                formik.setFieldValue('admin', value)
              }
              onBlur={formik.handleBlur}
              getOptionValue={(options) => options.id.toString()}
              getOptionLabel={(options) => options.name}
              options={selectEmployeeOptions}
            />
          </FieldWraper>
          <FieldWraper
            controller="select"
            name="allowedDepartments"
            label="Department"
            error={
              formik.touched.allowedDepartments &&
              formik.errors?.allowedDepartments
            }
          >
            <Select
              name="allowedDepartments"
              value={formik.values.allowedDepartments}
              onChange={(value: MultiValue<iDepartment>) =>
                formik.setFieldValue('allowedDepartments', value)
              }
              isMulti={true}
              onBlur={formik.handleBlur}
              getOptionValue={(options) => options.id.toString()}
              getOptionLabel={(options) => options.name}
              options={departmentOptions}
            />
          </FieldWraper>
          <FormController
            controller="checkbox"
            name="canHaveSubGroup"
            value={formik.values.canHaveSubGroup}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Allow to add sub group"
          />
          <FormController
            controller="checkbox"
            name="canHaveMembers"
            value={formik.values.canHaveMembers}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Allow to add member"
          />

          <FieldWraper
            controller="select"
            name="children"
            label="Sub Group"
            error={formik.touched.children && formik.errors?.children}
          >
            <Select
              name="children"
              isDisabled={!formik.values.canHaveSubGroup}
              value={formik.values.children}
              onChange={(value: MultiValue<iDepartment>) =>
                formik.setFieldValue('children', value)
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
            controller="select"
            name="members"
            label="Members"
            error={formik.touched.members && formik.errors?.members}
          >
            <Select
              name="members"
              value={formik.values.members}
              isDisabled={!formik.values.canHaveMembers}
              onChange={(value: MultiValue<iEmployee>) =>
                formik.setFieldValue('members', value)
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
            controller="checkbox"
            name="removable"
            value={formik.values.removable}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            label="Yes,You can remove this group."
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
