import { useEffect, useState } from 'react';
import { MultiValue } from 'react-select';
import { FilterOptionOption } from 'react-select/dist/declarations/src/filters';
import { deleteEmployeeAPI } from '../../components/employee/actions';
import { selectAllEmployee } from '../../components/employee/employeeSlice';
import { deleteGroupAllDetailsAPI } from '../../components/group_info/actions';
import {
  selectAllAdminIndex,
  selectAllGroupAllDetails,
  selectAllGroupAllDetailsById,
  selectAllGroupMember,
  selectAllGroupMemberByEmployeeId,
} from '../../components/group_info/groupInfoSlice';
import iEmployee, {
  iHandleEpmloyeeAction,
  iSelectedEmployeeOption,
} from '../../types/employee';
import { iGroupAllDetails, iHandleGroupDetailAction } from '../../types/group';
import { useAppDispatch, useAppSelector } from '../store/utilityHooks';

export default function useHome() {
  const [selectedGroupOption, setSelectedGroupOption] =
    useState<MultiValue<iGroupAllDetails>>();
  // const [arrayOfRoot, setArrayOfRoot] =
  //   useState<MultiValue<iGroupAllDetails>>();
  const [selectedEmpoyeeOption, setSelectedEmpoyeeOption] =
    useState<iSelectedEmployeeOption>();
  const allGroupDataOptions = useAppSelector(selectAllGroupAllDetails);
  const [groupDataOptions, setGroupDataOptions] = useState(allGroupDataOptions);
  const empoyeeDataOptions = useAppSelector(selectAllEmployee);
  const groupAllDetailsById = useAppSelector(selectAllGroupAllDetailsById);
  const adminIndex = useAppSelector(selectAllAdminIndex);
  const groupMemberByEmployeeId = useAppSelector(
    selectAllGroupMemberByEmployeeId
  );
  const groupMember = useAppSelector(selectAllGroupMember);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showGroupDetailsModal, setShowGroupDetailsModal] = useState(false);
  const [expandAll, setExpandAll] = useState(true);
  const [selectedEmpoyeeData, setSelectedEmpoyeeData] = useState<iEmployee>();
  const [selectedGroupDetailData, setSelectedGroupDetailData] =
    useState<iGroupAllDetails>();
  const dispatch = useAppDispatch();
  const handleGroupChange = (option: MultiValue<iGroupAllDetails>) => {
    setSelectedGroupOption(option);
    // setArrayOfRoot(option);
    setExpandAll(true);
  };
  const handleEmpoyeeChange = (option: iSelectedEmployeeOption) => {
    setSelectedEmpoyeeOption(option);
    if (option) {
      const newGroupDataOptions: iGroupAllDetails[] = [];
      const newGroupDataOptionsObj: Record<number, number> = {};
      const adminArray = adminIndex[option.id]?.reduce<iGroupAllDetails[]>(
        (newArray, groupId) => {
          newGroupDataOptionsObj[groupId] = groupId;
          const groupDetail = groupAllDetailsById[groupId];
          return groupDetail ? newArray.concat(groupDetail) : newArray;
        },
        []
      );
      if (adminArray) {
        newGroupDataOptions.push(...adminArray);
      }
      const memberArray = groupMemberByEmployeeId[option.id]?.reduce<
        iGroupAllDetails[]
      >((newArray, memberId) => {
        const groupId = groupMember[memberId].group_id;
        newGroupDataOptionsObj[groupId] = groupId;
        const groupDetail = groupAllDetailsById[groupId];
        return groupDetail ? newArray.concat(groupDetail) : newArray;
      }, []);
      if (memberArray) {
        newGroupDataOptions.push(...memberArray);
      }
      setGroupDataOptions(newGroupDataOptions);
      setSelectedGroupOption(newGroupDataOptions);
    } else {
      setGroupDataOptions(allGroupDataOptions);
    }
  };
  const empoyeeFilterLogic = (
    option: FilterOptionOption<iEmployee>,
    input: string
  ) => {
    if (input) {
      const newInput = input.trim().toLowerCase();
      return (
        option.data.name?.toLowerCase().includes(newInput) ||
        option.data.email_id?.toLowerCase().includes(newInput) ||
        option.data.phone_number?.toLowerCase().includes(newInput) ||
        option.data.username?.toLowerCase().includes(newInput)
      );
    }
    return true;
  };
  const handleEpmloyeeAction: iHandleEpmloyeeAction = (type, data) => {
    if (type === 'edit') {
      setSelectedEmpoyeeData(data);
      setShowEmployeeModal(true);
    } else if (type === 'add') {
      setShowEmployeeModal(true);
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
  const handleGroupDetailAction: iHandleGroupDetailAction = (type, data) => {
    if (type === 'edit') {
      setSelectedGroupDetailData(data);
      setShowGroupDetailsModal(true);
    } else if (type === 'add') {
      setShowGroupDetailsModal(true);
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
  };
  const handleCloseEmployeeModal = () => {
    setSelectedEmpoyeeData(undefined);
    setShowEmployeeModal(false);
  };
  const handleCloseGroupDetailsModal = () => {
    setSelectedGroupDetailData(undefined);
    setShowGroupDetailsModal(false);
  };
  useEffect(() => {
    if (selectedEmpoyeeOption) {
      handleEmpoyeeChange(selectedEmpoyeeOption);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminIndex, groupMemberByEmployeeId]);

  return {
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
  };
}
