import { Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import ThemeSelect from './ThemeSelect';
export default function Header() {
  return (
    <div className="w-full navbar bg-base-100 shadow-md mb-4">
      <div className="flex-1">
        <Link href="/">
          <a className="btn btn-ghost normal-case text-xl">Hierarchy</a>
        </Link>
      </div>
      <div className="flex-none hidden sm:block">
        <ul className="menu menu-horizontal">
          <li>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li tabIndex={0}>
            <a>
              Data
              <ChevronDownIcon className="ml-1 h-3 w-3 fill-current" />
            </a>
            <ul className="p-2 bg-base-100 shadow-md z-20">
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
            </ul>
          </li>
        </ul>
      </div>
      <div className="flex-none">
        <ThemeSelect />
      </div>
      <div className="flex-none sm:hidden">
        <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
          <Bars3Icon className="ml-1 h-8 w-8 fill-current" />
        </label>
      </div>
    </div>
  );
}
