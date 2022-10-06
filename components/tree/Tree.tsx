import { useMemo } from 'react';
import type iTree from '../../types/tree';
import ItemList from './ItemList';
export interface iTreeProps {
  root?: iTree;
}
export default function Tree({ root }: iTreeProps) {
  const color_gen = useMemo(
    () => Math.floor(Math.random() * 16777215).toString(16),
    []
  );
  if (!root) return null;
  return (
    <div className="collapse">
      <input type="checkbox" className="min-h-fit" defaultChecked={true} />
      <div className="collapse-title p-1 min-h-fit text-xl font-medium space-x-3">
        <span>{root.name + ' | ' + root.admin?.name}</span>
      </div>
      <div
        className="collapse-content ml-4 !pb-0 mb-3"
        style={{ borderLeftColor: `#${color_gen}`, borderLeftWidth: 2 }}
      >
        {root.members?.map((item) => (
          <div key={item.id} className="cursor-pointer">
            <span className=" hover:bg-gray-100 transition truncate">
              {item.name}
            </span>
            {item?.title && (
              <span className=" hover:bg-gray-100 transition px-1 truncate text-xs font-light">
                ({item.title})
              </span>
            )}
          </div>
        ))}
        {root?.children?.map((item, index) => (
          <ItemList key={item.id} root={item} />
        ))}
      </div>
    </div>
  );
}
