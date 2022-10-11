import Link from 'next/link';
import { PropsWithChildren } from 'react';
import Header from './Header';

export default function Drawer(props: PropsWithChildren) {
  const handleResetData = () => {
    localStorage.clear();
    window.location.reload();
  };
  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        <Header />
        {props.children}
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu p-4 overflow-y-auto w-80 bg-base-100">
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link href="/employee">
              <a>Employee</a>
            </Link>
          </li>
          <li>
            <Link href="/group-info">
              <a>Group</a>
            </Link>
          </li>
          <li>
            <Link href="/department-info">
              <a>Department</a>
            </Link>
          </li>
          <li>
            <button onClick={handleResetData}>Reset Data</button>
          </li>
        </ul>
      </div>
    </div>
  );
}
