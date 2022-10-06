import { iDepartment } from '../types/department';

export const departmentData: Record<number, iDepartment> = {
  1: {
    id: 1,
    name: 'HR',
  },
  2: {
    id: 2,
    name: 'design',
  },
  3: {
    id: 3,
    name: 'sales',
  },
  4: {
    id: 4,
    name: 'Engineering',
  },
};
export const departmentDataByName: Record<string, number> = {
  hr: 1,
  HR: 2,
  sales: 3,
  engineering: 4,
};
