import iEmployee from '../../types/employee';
import { iGroupAllDetails } from '../../types/group';
import iTreeRoot from '../../types/tree';
// export const getTreeData=(groupId:number)=>(dispatch: AppDispatch, getState: () => RootState)=>{
//     const state = getState()
//     const groupAllDetailsById = state.group.groupAllDetails
//     const employeeById = state.employee.employee
//     return

// }
export const getTreeData = (
  groupId: number,
  groupAllDetailsById: Record<number, iGroupAllDetails>,
  employeeById: Record<number, iEmployee>
) => {
  const groupDetails = groupAllDetailsById[groupId];
  const treeData: iTreeRoot = {
    ...groupDetails,
    admin: employeeById[groupDetails?.admin],
    children: groupDetails?.children?.map((child) =>
      getTreeData(child.child_group_id, groupAllDetailsById, employeeById)
    ),
    members: groupDetails?.members?.map((member) => {
      const { id, ...rest } = employeeById[member?.employee_id];
      return { ...member, ...rest };
    }),
  };
  return treeData;
};
