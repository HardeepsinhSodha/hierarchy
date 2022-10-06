import { PencilIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useMemo, useState } from 'react';
import { selectAllDepartmentById } from '../components/department/departmentSlice';
import { deleteEmployeeAPI } from '../components/employee/actions';
import EmployeeForm from '../components/employee/EmployeeForm';
import { selectAllEmployee } from '../components/employee/employeeSlice';
import Table from '../components/table/Table';
import { useAppDispatch, useAppSelector } from '../hooks/store/utilityHooks';
import iEmployee from '../types/employee';
const EmployeeTable: NextPage = () => {
  const [show, setShow] = useState(false);
  const [selectedData, setSelectedData] = useState<iEmployee>();
  const dispatch = useAppDispatch();
  const employeeData = useAppSelector(selectAllEmployee);
  const departmentOptions = useAppSelector(selectAllDepartmentById);
  const handleAction = (type: 'edit' | 'delete' | 'add', data?: iEmployee) => {
    if (type === 'edit') {
      setSelectedData(data);
      setShow(true);
    } else if (type === 'add') {
      setShow(true);
    } else {
      dispatch(
        deleteEmployeeAPI(
          data as iEmployee,
          () => {},
          () => {}
        )
      );
    }
  };
  const handleClose = () => {
    setSelectedData(undefined);
    setShow(false);
  };
  const columns = useMemo(
    () => [
      {
        Header: 'Employee',
        columns: [
          {
            Header: 'Sr.No.',
            accessor: (_: any, rowIndex: number) => rowIndex + 1,
            id: 'srno',
          },
          {
            Header: 'Employee Id',
            accessor: 'id',
          },
          {
            Header: 'Name',
            accessor: 'name',
          },
          {
            Header: 'Username',
            accessor: 'username',
          },
          {
            Header: 'Department',
            accessor: 'department',
            Cell: ({ row }: any) =>
              departmentOptions[row.original.department]?.name ?? '',
          },
          {
            Header: 'Email Id',
            accessor: 'email_id',
          },
          {
            Header: 'Phone Number',
            accessor: 'phone_number',
          },
          {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ row }: any) => (
              <div className="flex justify-around">
                <PencilIcon
                  className="w-8 h-8 cursor-pointer"
                  onClick={() =>
                    handleAction('edit', row.original as iEmployee)
                  }
                />
                <TrashIcon
                  className="w-8 h-8 cursor-pointer"
                  onClick={() =>
                    handleAction('delete', row.original as iEmployee)
                  }
                />
              </div>
            ),
          },
        ],
      },
    ],
    []
  );

  return (
    <>
      <Head>
        <title>Employee</title>
        <meta name="description" content="employee data" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-end m-4">
        <button
          className="btn btn-primary gap-3"
          onClick={() => handleAction('add')}
        >
          <UserPlusIcon className="w-8 h-8" />
          Add Employee
        </button>
      </div>
      <div className="card shadow-md m-4 overflow-auto">
        <Table data={employeeData} columns={columns} />
      </div>
      <EmployeeForm show={show} handleClose={handleClose} data={selectedData} />
    </>
  );
};
export default EmployeeTable;
