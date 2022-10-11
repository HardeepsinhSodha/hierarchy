import { iDepartment } from '../types/department';

export const departmentData: Record<number, iDepartment> = {
  1: {
    id: 1,
    name: 'Rogue ninja',
  },
  2: {
    id: 2,
    name: 'Hidden Leaf',
  },
  3: {
    id: 3,
    name: 'Anbu Black Ops',
  },
};
export const departmentDataByName: Record<string, number> = {
  'rogue ninja': 1,
  'hidden leaf': 2,
  'anbu black ops': 3,
};
