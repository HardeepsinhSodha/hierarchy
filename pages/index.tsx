import { UserPlusIcon } from '@heroicons/react/24/solid';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import ReactSelect from 'react-select';
import { deleteEmployeeAPI } from '../components/employee/actions';
import EmployeeForm from '../components/employee/EmployeeForm';
import { selectAllEmployeeById } from '../components/employee/employeeSlice';
import FieldWraper from '../components/form_field/FieldWrapper';
import {
  selectAllGroupAllDetails,
  selectAllGroupAllDetailsById,
} from '../components/group_info/groupInfoSlice';
import { getTreeData } from '../components/tree/actions';
import Tree from '../components/tree/Tree';
import { useAppDispatch, useAppSelector } from '../hooks/store/utilityHooks';
import iEmployee from '../types/employee';
import { iGroupAllDetails } from '../types/group';
import iTreeRoot from '../types/tree';

const Home: NextPage = () => {
  const [data, setData] = useState<iTreeRoot>();
  const [selectedGroupOption, setSelectedGroupOption] = useState<
    iGroupAllDetails | null | undefined
  >();
  const groupAllDetailsById = useAppSelector(selectAllGroupAllDetailsById);
  const employeeById = useAppSelector(selectAllEmployeeById);
  const groupDataOptions = useAppSelector(selectAllGroupAllDetails);
  const [show, setShow] = useState(false);
  const [expandAll, setExpandAll] = useState(true);
  const [selectedData, setSelectedData] = useState<iEmployee>();
  const dispatch = useAppDispatch();
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
  useEffect(() => {
    if (selectedGroupOption) {
      setData(
        getTreeData(
          selectedGroupOption?.id as number,
          groupAllDetailsById,
          employeeById
        )
      );
    }
  }, [employeeById, groupAllDetailsById, selectedGroupOption]);

  return (
    <div>
      <Head>
        <title>Hierachy</title>
        <meta
          name="description"
          content="Create hierachy of your organization"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 place-content-start items-center">
        <FieldWraper name="group" label="Group" controller="select">
          <ReactSelect
            name="department"
            value={selectedGroupOption}
            onChange={setSelectedGroupOption}
            getOptionValue={(options) => options.id.toString()}
            getOptionLabel={(options) => options.name}
            options={groupDataOptions}
            menuPlacement="top"
          />
        </FieldWraper>
        <button
          className="btn btn-primary gap-3 mt-auto mb-3"
          onClick={() => handleAction('add')}
        >
          <UserPlusIcon className="w-8 h-8" />
          Add Employee
        </button>
        <button
          className="btn btn-primary gap-3 mt-auto mb-3"
          onClick={() => setExpandAll(!expandAll)}
        >
          {expandAll ? 'Collapse All' : 'Expand All'}
        </button>
      </div>
      <div className="card bg-base-100 shadow-md m-4 overflow-auto">
        <div className="card-body">
          <Tree root={data} />
        </div>
      </div>
      <EmployeeForm show={show} handleClose={handleClose} data={selectedData} />
    </div>
  );
};

export default Home;
