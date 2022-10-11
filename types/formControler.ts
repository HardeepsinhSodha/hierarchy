import { ReactNode } from 'react';

export type iFormController = 'input' | 'inputGroup' | 'checkbox' | 'select';
export interface iFieldWraperProps {
  label?: string;
  error?: string | false;
  secondaryLabel?: string;
  name: string;
  children: ReactNode;
  additionalDivClassName?: string;
  controller: iFormController;
}
