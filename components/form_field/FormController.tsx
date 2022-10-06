import {
  CheckboxField,
  iInputProps,
  InputField,
  InputGroupField,
} from './Fields';
import FieldWrapper, { iFieldWraperProps } from './FieldWrapper';

export interface FormControllerProps
  extends Omit<iFieldWraperProps, 'children'>,
    iInputProps {}
const fieldMaping = {
  input: InputField,
  inputGroup: InputGroupField,
  checkbox: CheckboxField,
  select: InputField,
};
export default function FormController(props: FormControllerProps) {
  const Field = fieldMaping?.[props.controller];

  return (
    <FieldWrapper {...props}>
      <Field {...props} />
    </FieldWrapper>
  );
}
