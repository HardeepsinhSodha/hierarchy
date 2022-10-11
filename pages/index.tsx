import { UserGroupIcon, UserPlusIcon } from '@heroicons/react/24/solid';
import type { NextPage } from 'next';
import Head from 'next/head';
import ReactSelect from 'react-select';
import EmployeeForm from '../components/employee/EmployeeForm';
import FieldWraper from '../components/form_field/FieldWrapper';
import GroupAllDetailsForm from '../components/group_info/GroupAllDetailsForm';
import { controller as S } from '../components/tree/controller';
import Tree from '../components/tree/Tree';
import useHome from '../hooks/home/useHome';
import { commonRSStyle } from '../utility/const';
const Home: NextPage = () => {
  const {
    selectedEmpoyeeOption,
    handleEmpoyeeChange,
    selectedGroupOption,
    groupDataOptions,
    empoyeeDataOptions,
    showEmployeeModal,
    showGroupDetailsModal,
    expandAll,
    selectedEmpoyeeData,
    selectedGroupDetailData,
    groupAllDetailsById,
    setExpandAll,
    handleGroupChange,
    empoyeeFilterLogic,
    handleEpmloyeeAction,
    handleGroupDetailAction,
    handleCloseEmployeeModal,
    handleCloseGroupDetailsModal,
  } = useHome();

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
      <div className="flex flex-wrap space-x-3 items-center">
        <FieldWraper {...S.formField.employee}>
          <ReactSelect
            id={S.formField.employee.id}
            name={S.formField.employee.name}
            value={selectedEmpoyeeOption}
            onChange={handleEmpoyeeChange}
            getOptionValue={(options) => `${options.id}`}
            getOptionLabel={(options) => options.name}
            options={empoyeeDataOptions}
            menuPlacement="top"
            isClearable={true}
            filterOption={empoyeeFilterLogic}
            placeholder={S.formField.employee.placeholder}
            {...commonRSStyle}
          />
        </FieldWraper>
        <FieldWraper {...S.formField.group}>
          <ReactSelect
            id={S.formField.group.id}
            name={S.formField.group.name}
            value={selectedGroupOption}
            onChange={handleGroupChange}
            getOptionValue={(options) => options.id.toString()}
            getOptionLabel={(options) => options.name}
            options={groupDataOptions}
            isMulti={true}
            {...commonRSStyle}
            className="react-select__control react-select__menu react-select__option"
          />
        </FieldWraper>
        <button
          className="btn btn-primary gap-3 mt-auto mb-3"
          onClick={() => handleEpmloyeeAction('add')}
        >
          <UserPlusIcon className="w-8 h-8" />
          {S.addEmployee}
        </button>
        <button
          className="btn btn-primary gap-3 mt-auto mb-3"
          onClick={() => handleGroupDetailAction('add')}
        >
          <UserGroupIcon className="w-8 h-8" />
          {S.createGroup}
        </button>
        <div className="space-x-2 mt-auto mb-3">
          <button
            className="btn btn-primary"
            disabled={!selectedGroupOption}
            onClick={() => setExpandAll(true)}
          >
            {S.expandAll}
          </button>
          <button
            className="btn btn-primary"
            disabled={!selectedGroupOption}
            onClick={() => setExpandAll(false)}
          >
            {S.collapseAll}
          </button>
        </div>
      </div>
      {selectedGroupOption?.map((root) => (
        <div
          data-test-id="tree"
          key={root.id}
          className="card bg-base-100 shadow-md m-4"
        >
          <div className="card-body">
            <Tree
              root={groupAllDetailsById[root.id]}
              expandAll={expandAll}
              handleEpmloyeeAction={handleEpmloyeeAction}
              setExpandAll={setExpandAll}
              handleGroupDetailAction={handleGroupDetailAction}
            />
          </div>
        </div>
      ))}

      <EmployeeForm
        show={showEmployeeModal}
        handleClose={handleCloseEmployeeModal}
        data={selectedEmpoyeeData}
      />
      <GroupAllDetailsForm
        show={showGroupDetailsModal}
        handleClose={handleCloseGroupDetailsModal}
        data={selectedGroupDetailData}
      />
    </div>
  );
};

export default Home;
