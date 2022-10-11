import {
  PencilIcon,
  RocketLaunchIcon,
  UserGroupIcon,
} from '@heroicons/react/24/solid';
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useId,
  useMemo,
  useState,
} from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/store/utilityHooks';
import iEmployee, { iHandleEpmloyeeAction } from '../../types/employee';
import {
  iHandleGroupDetailAction,
  iSelectedGroupOption,
} from '../../types/group';
import ToolTipSquareButton from '../button/ToolTipSquareButton';
import { selectAllEmployeeById } from '../employee/employeeSlice';
import { promoteAdminAPI, promoteMemberAPI } from '../group_info/actions';
import { selectAllGroupAllDetailsById } from '../group_info/groupInfoSlice';
export interface iTreeProps {
  root: iSelectedGroupOption;
  expandAll: boolean;
  handleEpmloyeeAction: iHandleEpmloyeeAction;
  handleGroupDetailAction: iHandleGroupDetailAction;
  setExpandAll?: Dispatch<SetStateAction<boolean>>;
}
export default function Tree({
  root,
  expandAll,
  handleEpmloyeeAction,
  handleGroupDetailAction,
  setExpandAll,
}: iTreeProps) {
  const employeeById = useAppSelector(selectAllEmployeeById);
  const groupAllDetailsById = useAppSelector(selectAllGroupAllDetailsById);
  const [open, setOpen] = useState(expandAll);
  const id = useId();
  const dispatch = useAppDispatch();
  const color_gen = useMemo(
    () => Math.floor(Math.random() * 16777215).toString(16),
    []
  );
  useEffect(() => {
    if (!setExpandAll) {
      setOpen(expandAll);
    }
  }, [expandAll, setExpandAll]);

  if (!root) return null;

  const adminDetails: iEmployee | undefined = root?.admin
    ? employeeById[root.admin]
    : undefined;
  return (
    <div className={`collapse`}>
      <input
        id={id}
        type="checkbox"
        className="min-h-fit w-0"
        checked={setExpandAll ? expandAll : open}
        onChange={() => {
          setExpandAll ? setExpandAll(!expandAll) : setOpen(!open);
        }}
      />
      <div className="collapse-title p-1 min-h-fit text-xl font-medium space-x-3 !cursor-[initial]">
        <label htmlFor={id} className="cursor-pointer">
          {root.name + ' | '}
          {adminDetails?.name ? (
            adminDetails?.name
          ) : (
            <span className="text-error">NA</span>
          )}
          {root?.title ? (
            <span className="px-1 truncate text-xs font-light">
              {root.title}
            </span>
          ) : (
            ''
          )}
        </label>
        {adminDetails && (
          <ToolTipSquareButton
            message={`Edit ${adminDetails?.username}'s details`}
            onClick={() => handleEpmloyeeAction('edit', adminDetails)}
            btnClassName="btn-sm btn-active"
          >
            <PencilIcon
              data-test-id="editEmployeeDetails"
              className="w-4 h-4"
            />
          </ToolTipSquareButton>
        )}
        <ToolTipSquareButton
          message={`Edit ${root.name}'s details`}
          onClick={() => handleGroupDetailAction('edit', root)}
          btnClassName="btn-sm btn-active"
        >
          <UserGroupIcon data-test-id="editGroupDetails" className="w-4 h-4" />
        </ToolTipSquareButton>
        {adminDetails && (
          <ToolTipSquareButton
            message={`Promote ${adminDetails.username ?? adminDetails.name}`}
            onClick={() => dispatch(promoteAdminAPI(root, adminDetails.id))}
            btnClassName="btn-sm btn-active"
          >
            <RocketLaunchIcon data-test-id="promoteAdmin" className="w-4 h-4" />
          </ToolTipSquareButton>
        )}
      </div>
      <div
        className="collapse-content ml-4 !pb-0 mb-3"
        style={{ borderLeftColor: `#${color_gen}`, borderLeftWidth: 2 }}
      >
        {root.members?.map((item) => {
          const memberDetails = employeeById[item.employee_id];
          return (
            <div
              key={item.id}
              className="showBtnOnHover hover:bg-base-300 hover:text-base-content transition space-x-2 rounded-md p-2"
            >
              <span className="truncate">{memberDetails.name}</span>
              {item?.title && (
                <span className="px-1 truncate text-xs font-light">
                  ({item.title})
                </span>
              )}
              <ToolTipSquareButton
                message={`Edit ${
                  memberDetails.username ?? memberDetails.name
                }'s details`}
                onClick={() => handleEpmloyeeAction('edit', memberDetails)}
                btnClassName="btn-sm btn-active"
              >
                <PencilIcon
                  data-test-id="editEmployeeDetails"
                  className="w-4 h-4"
                />
              </ToolTipSquareButton>
              <ToolTipSquareButton
                message={`Promote ${
                  memberDetails.username ?? memberDetails.name
                }`}
                onClick={() =>
                  dispatch(promoteMemberAPI(root, memberDetails.id))
                }
                btnClassName="btn-sm btn-active"
              >
                <RocketLaunchIcon
                  data-test-id="promoteEmployee"
                  className="w-4 h-4"
                />
              </ToolTipSquareButton>
            </div>
          );
        })}
        {root?.children?.map((item) => (
          <Tree
            key={item.id}
            root={groupAllDetailsById[item.child_group_id]}
            expandAll={expandAll}
            handleEpmloyeeAction={handleEpmloyeeAction}
            handleGroupDetailAction={handleGroupDetailAction}
          />
        ))}
      </div>
    </div>
  );
}
