import type iTree from '../types/tree';

export const data: iTree = {
  id: 1,
  name: 'CEO',
  title: '',
  removable: false,
  canHaveSubGroup: true,
  canHaveMembers: true,
  allowedDepartments: [],
  admin: {
    id: 1,
    name: 'Hashirama Sanju',
    department: 1,
    username: 'Hashirama',
    email_id: 'hashiramaSanju@naruto.in',
    phone_number: '+1 9898956562',
  },
  children: [
    {
      id: 2,
      name: 'Head Of Akatsuki',
      title: '',
      allowedDepartments: [1, 2],
      removable: true,
      canHaveSubGroup: false,
      canHaveMembers: true,
      admin: {
        id: 2,
        name: 'Obito Uchiha',
        department: 1,
        username: 'Obito',
        email_id: 'Obito@naruto.in',
        phone_number: '+1 9898956562',
      },
      children: [],
      members: [
        {
          id: 2,
          group_id: 2,
          employee_id: 3,
          title: '',
          joining_date: '03/10/2022',
          left_data: undefined,
          name: 'Itachi Uchiha',
          username: 'Itachi',
          email_id: 'Itachi@naruto.in',
          phone_number: '+1 9898956562',
          department: 1,
        },
        {
          id: 3,
          group_id: 2,
          employee_id: 4,
          title: '',
          joining_date: '03/10/2022',
          left_data: undefined,
          name: 'Nagato',
          username: 'Pain',
          email_id: 'Pain@naruto.in',
          phone_number: '+1 9898956562',
          department: 1,
        },
      ],
    },
    {
      id: 3,
      name: 'Hidden leaf',
      title: 'Hokage',
      removable: true,
      allowedDepartments: [1, 2],
      canHaveSubGroup: true,
      canHaveMembers: true,
      admin: {
        id: 2,
        name: 'Sarutobi Hiruzen',
        department: 1,
        username: 'Sarutobi',
        email_id: 'Sarutobi@naruto.in',
        phone_number: '+1 9898956562',
      },
      children: [
        {
          id: 3,
          name: 'Team 7',
          title: 'Team Lead',
          allowedDepartments: [1, 2],
          canHaveSubGroup: false,
          canHaveMembers: true,
          removable: true,
          admin: {
            id: 2,
            name: 'Kakashi Hatake',
            username: 'Kakashi',
            email_id: 'Kakashi@naruto.in',
            phone_number: '+1 9898956562',
            department: 1,
          },
          children: [],
          members: [
            {
              id: 2,
              group_id: 2,
              employee_id: 3,
              department: 1,
              title: '',
              joining_date: '03/10/2022',
              left_data: undefined,
              name: 'Sasuke Uchiha',
              username: 'Sasuke',
              email_id: 'Sasuke@naruto.in',
              phone_number: '+1 9898956562',
            },
            {
              id: 3,
              group_id: 2,
              employee_id: 4,
              department: 1,
              title: '',
              joining_date: '03/10/2022',
              left_data: undefined,
              name: 'Naruto Uzumaki',
              username: 'Naruto',
              email_id: 'Naruto@naruto.in',
              phone_number: '+1 9898956562',
            },
          ],
        },
      ],
      members: [
        {
          id: 2,
          group_id: 2,
          employee_id: 3,
          title: 'Backend Lead',
          department: 1,
          joining_date: '03/10/2022',
          left_data: undefined,
          name: 'Itachi Uchiha',
          username: 'Itachi',
          email_id: 'Itachi@naruto.in',
          phone_number: '+1 9898956562',
        },
        {
          id: 3,
          group_id: 2,
          employee_id: 4,
          department: 1,
          title: '',
          joining_date: '03/10/2022',
          left_data: undefined,
          name: 'Nagato',
          username: 'Pain',
          email_id: 'Pain@naruto.in',
          phone_number: '+1 9898956562',
        },
      ],
    },
  ],
  members: [],
};