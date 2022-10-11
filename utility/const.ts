import { Theme } from 'react-select';
export const themeOptions: Array<string> = [
  'light',
  'dark',
  'cupcake',
  'bumblebee',
  'emerald',
  'corporate',
  'synthwave',
  'retro',
  'cyberpunk',
  'valentine',
  'halloween',
  'garden',
  'forest',
  'aqua',
  'lofi',
  'pastel',
  'fantasy',
  'wireframe',
  'black',
  'luxury',
  'dracula',
  'cmyk',
  'autumn',
  'business',
  'acid',
  'lemonade',
  'night',
  'coffee',
  'winter',
];
export const reactSelectTheme = (theme: Theme) => {
  return {
    ...theme,
    colors: {
      ...theme.colors,
      primary: 'hsl(var(--pf))',
      primary75: 'hsl(var(--pf))',
      primary50: 'hsl(var(--p))',
      primary25: 'hsl(var(--p))',
      danger: 'hsl(var(--er))',
      // neutral0: 'hsl(var(--b1))',
      neutral10: 'hsl(var(--b3))', //muti select text bg,
      neutral20: 'hsl(var(--bc))', //arrow
      // neutral30: 'hsl(var(--b2))',
      // neutral40: 'hsl(var(--b3))',
      neutral50: 'hsl(var(--bc))', // placeholder,
      neutral60: 'hsl(var(--bc))', // action button
      // neutral170: 'hsl(var(--bc))',
      neutral80: 'hsl(var(--bc))', // selected text
      // neutral90: 'hsl(var(--bc))',
    },
  };
};
export const commonRSStyle = {
  classNamePrefix: 'react-select',
  className: 'react-select__control react-select__menu react-select__option',
  theme: reactSelectTheme,
};
