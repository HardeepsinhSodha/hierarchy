import {
  PencilIcon,
  TrashIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useCallback, useMemo, useState } from 'react';
import { selectAllDepartmentById } from '../components/department/departmentSlice';
import { selectAllEmployeeById } from '../components/employee/employeeSlice';
import { deleteGroupAllDetailsAPI } from '../components/group_info/actions';
import GroupAllDetailsForm from '../components/group_info/GroupAllDetailsForm';
import {
  selectAllGroupAllDetails,
  selectAllGroupAllDetailsById,
} from '../components/group_info/groupInfoSlice';
import Table from '../components/table/Table';
import { useAppDispatch, useAppSelector } from '../hooks/store/utilityHooks';
import {
  iGroupAllDetails,
  iGroupMapping,
  iGroupMemberData,
} from '../types/group';
const GroupAllDetailsTable: NextPage = () => {
  const [show, setShow] = useState(false);
  const [selectedData, setSelectedData] = useState<iGroupAllDetails>();
  const dispatch = useAppDispatch();
  const GroupAllDetailsData = useAppSelector(selectAllGroupAllDetails);
  const GroupAllDetailsDataById = useAppSelector(selectAllGroupAllDetailsById);
  const EmployeeByIdData = useAppSelector(selectAllEmployeeById);
  const allDepartmentById = useAppSelector(selectAllDepartmentById);
  const handleAction = useCallback(
    (type: 'edit' | 'delete' | 'add', data?: iGroupAllDetails) => {
      if (type === 'edit') {
        setSelectedData(data);
        setShow(true);
      } else if (type === 'add') {
        setShow(true);
      } else {
        dispatch(
          deleteGroupAllDetailsAPI(
            data as iGroupAllDetails,
            () => {
              null;
            },
            () => {
              null;
            }
          )
        );
      }
    },
    [dispatch]
  );
  const handleClose = () => {
    setSelectedData(undefined);
    setShow(false);
  };
  const columns = useMemo(
    () => [
      {
        Header: 'Group',
        columns: [
          {
            Header: 'Sr.No.',
            accessor: (_: iGroupAllDetails, rowIndex: number) => rowIndex + 1,
            id: 'srno',
          },
          {
            Header: 'Group Id',
            accessor: 'id',
          },
          {
            Header: 'Group Name',
            accessor: 'name',
          },
          {
            Header: 'Title',
            id: 'title',
            accessor: (row: iGroupAllDetails) =>
              row?.title ? row?.title : '-',
          },
          {
            Header: 'Head',
            id: 'admin',
            accessor: (row: iGroupAllDetails) =>
              row?.admin ? EmployeeByIdData[row?.admin]?.username : '',
          },
          {
            Header: "Detartment's member allow",
            accessor: 'allowedDepartments',
            Cell: ({ row }: any) => (
              <div className="flex max-w-64 w-full flex-wrap">
                {row.original.allowedDepartments?.map((department: number) => (
                  <p
                    key={department}
                    className="bg-secondary text-secondary-content m-2 rounded p-2"
                  >
                    {allDepartmentById[department]?.name}
                  </p>
                ))}
              </div>
            ),
          },
          {
            Header: 'Can Delete',
            id: 'removable',
            accessor: (row: iGroupAllDetails) => (row.removable ? 'Yes' : 'No'),
          },
          {
            Header: 'Sub-Group Allow',
            id: 'canHaveSubGroup',
            accessor: (row: iGroupAllDetails) =>
              row.canHaveSubGroup ? 'Yes' : 'No',
          },
          {
            Header: 'Memeber Allow',
            id: 'canHaveMembers',
            accessor: (row: iGroupAllDetails) =>
              row.canHaveMembers ? 'Yes' : 'No',
          },
          {
            Header: 'Members',
            accessor: 'members',
            Cell: ({ row }: any) => (
              <div className="flex max-w-64 w-full flex-wrap">
                {row.original.members?.map((member: iGroupMemberData) => (
                  <p
                    key={member?.id}
                    className="bg-secondary text-secondary-content m-2 rounded p-2"
                  >
                    {EmployeeByIdData[member?.employee_id]?.username}
                    {member?.title && (
                      <span className="px-1 truncate text-xs font-light">
                        ({member.title})
                      </span>
                    )}
                  </p>
                ))}
              </div>
            ),
          },
          {
            Header: 'Sub Group',
            accessor: 'children',
            Cell: ({ row }: any) => (
              <div className="flex max-w-64 w-full flex-wrap">
                {row.original.children?.map((child: iGroupMapping) => {
                  const groupDetails =
                    GroupAllDetailsDataById[child?.child_group_id];
                  return (
                    <p
                      key={child?.id}
                      className="bg-secondary text-secondary-content m-2 rounded p-2"
                    >
                      {groupDetails?.name}
                      {groupDetails?.title && (
                        <span className="px-1 truncate text-xs font-light">
                          ({groupDetails.title})
                        </span>
                      )}
                    </p>
                  );
                })}
              </div>
            ),
          },
          {
            Header: 'Actions',
            accessor: 'actions',
            Cell: ({ row }: any) => (
              <div className="flex justify-around">
                <PencilIcon
                  className="w-8 h-8 cursor-pointer"
                  data-test-id="edit"
                  onClick={() =>
                    handleAction('edit', row.original as iGroupAllDetails)
                  }
                />
                <TrashIcon
                  className="w-8 h-8 cursor-pointer"
                  data-test-id="delete"
                  onClick={() =>
                    handleAction('delete', row.original as iGroupAllDetails)
                  }
                />
              </div>
            ),
          },
        ],
      },
    ],
    [EmployeeByIdData, GroupAllDetailsDataById, handleAction]
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
          <UserGroupIcon className="w-8 h-8" />
          Add Group
        </button>
      </div>
      <div className="card shadow-md m-4 overflow-auto">
        <Table data={GroupAllDetailsData} columns={columns} />
      </div>
      <GroupAllDetailsForm
        show={show}
        handleClose={handleClose}
        data={selectedData}
      />
    </>
  );
};
export default GroupAllDetailsTable;
