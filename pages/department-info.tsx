import { PencilIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useMemo, useState } from 'react';
import { deleteDepartmentAPI } from '../components/department/actions';
import DepartmentForm from '../components/department/DepartmentForm';
import { selectAllDepartment } from '../components/department/departmentSlice';
import Table from '../components/table/Table';
import { useAppDispatch, useAppSelector } from '../hooks/store/utilityHooks';
import { iDepartment } from '../types/department';

const DepartmentTable: NextPage = () => {
  const [show, setShow] = useState(false);
  const [selectedData, setSelectedData] = useState<iDepartment>();
  const dispatch = useAppDispatch();
  const employeeData = useAppSelector(selectAllDepartment);
  const handleAction = (
    type: 'edit' | 'delete' | 'add',
    data?: iDepartment
  ) => {
    if (type === 'edit') {
      setSelectedData(data);
      setShow(true);
    } else if (type === 'add') {
      setShow(true);
    } else {
      dispatch(
        deleteDepartmentAPI(
          data as iDepartment,
          () => {
            null;
          },
          () => {
            null;
          }
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
        Header: 'Department',
        columns: [
          {
            Header: 'Sr.No.',
            accessor: (_: any, rowIndex: number) => rowIndex + 1,
            id: 'srno',
          },
          {
            Header: 'Department Id',
            accessor: 'id',
          },
          {
            Header: 'Name',
            accessor: 'name',
          },
          {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ row }: any) => (
              <div className="flex justify-around">
                <PencilIcon
                  className="w-8 h-8 cursor-pointer"
                  onClick={() =>
                    handleAction('edit', row.original as iDepartment)
                  }
                />
                <TrashIcon
                  className="w-8 h-8 cursor-pointer"
                  onClick={() =>
                    handleAction('delete', row.original as iDepartment)
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
        <title>Department</title>
        <meta name="description" content="employee data" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex justify-end m-4">
        <button
          className="btn btn-primary gap-3"
          onClick={() => handleAction('add')}
        >
          <UserPlusIcon className="w-8 h-8" />
          Add Department
        </button>
      </div>
      <div className="card shadow-md m-4 overflow-auto">
        <Table data={employeeData} columns={columns} />
      </div>
      <DepartmentForm
        show={show}
        handleClose={handleClose}
        data={selectedData}
      />
    </>
  );
};
export default DepartmentTable;
