import { ChevronDownIcon, SwatchIcon } from '@heroicons/react/24/solid';
import { useContext } from 'react';
import { themeOptions } from '../../utility/const';
import { ThemeContext } from './themeContext';

export default function ThemeSelect() {
  const { setTheme } = useContext(ThemeContext);
  return (
    <div title="Change Theme" className="dropdown dropdown-end">
      <div tabIndex={0} className="btn gap-1 normal-case btn-ghost">
        <SwatchIcon className="w-6 h-6" />
        <span className="hidden md:inline">Theme</span>
        <ChevronDownIcon className="ml-1 hidden h-3 w-3 fill-current opacity-60 sm:inline-block" />
      </div>
      <div
        tabIndex={0}
        className="dropdown-content bg-base-200 text-base-content rounded-t-box rounded-b-box top-px max-h-96 h-[70vh] w-52 overflow-y-auto shadow-2xl mt-16"
      >
        <div className="grid grid-cols-1 gap-3 p-3" tabIndex={0}>
          {themeOptions.map((theme: string, index: number) => (
            <div
              key={index}
              className="outline-base-content overflow-hidden rounded-lg outline-2 outline-offset-2"
              onClick={() => setTheme(theme)}
            >
              <div
                data-theme={theme}
                className="bg-base-100 text-base-content w-full cursor-pointer font-sans"
              >
                <div className="grid grid-cols-5 grid-rows-3">
                  <div className="col-span-5 row-span-3 row-start-1 flex gap-1 py-3 px-4">
                    <div className="flex-grow text-sm font-bold">{theme}</div>
                    <div className="flex flex-shrink-0 flex-wrap gap-1">
                      <div className="bg-primary w-2 rounded"></div>
                      <div className="bg-secondary w-2 rounded"></div>
                      <div className="bg-accent w-2 rounded"></div>
                      <div className="bg-neutral w-2 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
