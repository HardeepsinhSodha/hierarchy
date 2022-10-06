export interface iInputProps {
  type?: string;
  value: any;
  onChange: any;
  name: string;
  placeholder?: string;
  inputClaseName?: string;
  additionalClassName?: string;
  autoFocus?: boolean;
  prependText?: string;
  onBlur?: any;
}

export function InputField(props: iInputProps) {
  const {
    type = 'text',
    value,
    onChange,
    name,
    placeholder = '',
    inputClaseName = 'input input-bordered w-full max-w-xs',
    additionalClassName = '',
    autoFocus = false,
    onBlur,
  } = props;
  return (
    <input
      type={type}
      className={`${inputClaseName} ${additionalClassName}`}
      value={value}
      onChange={onChange}
      id={name}
      placeholder={placeholder}
      autoFocus={autoFocus}
      onBlur={onBlur}
    />
  );
}
export function InputGroupField(props: iInputProps) {
  const {
    type = 'text',
    value,
    onChange,
    name,
    placeholder = '',
    inputClaseName = 'input input-bordered',
    additionalClassName = '',
    autoFocus = false,
    prependText,
  } = props;
  return (
    <div className="flex flex-wrap w-full items-stretch">
      <span
        className="flex items-center px-2 py-1 text-center whitespace-nowrap bg-base-300 input rounded-tr-none rounded-br-none"
        id={name}
      >
        {prependText}
      </span>
      <input
        type={type}
        className={`${inputClaseName} ${additionalClassName} rounded-tl-none rounded-bl-none flex flex-grow flex-shrink w-1`}
        value={value}
        onChange={onChange}
        id={name}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
    </div>
  );
}
export function CheckboxField(props: iInputProps) {
  const {
    type = 'checkbox',
    value,
    onChange,
    name,
    placeholder = '',
    inputClaseName = 'checkbox max-w-xs',
    additionalClassName = '',
    autoFocus = false,
    onBlur,
  } = props;
  return (
    <input
      type={type}
      className={`${inputClaseName} ${additionalClassName}`}
      checked={value}
      onChange={onChange}
      id={name}
      placeholder={placeholder}
      autoFocus={autoFocus}
      onBlur={onBlur}
    />
  );
}
