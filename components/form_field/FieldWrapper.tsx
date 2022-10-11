import { iFieldWraperProps } from '../../types/formControler';

export default function FieldWraper(props: iFieldWraperProps) {
  const {
    label,
    error,
    secondaryLabel,
    name,
    additionalDivClassName,
    controller,
  } = props;
  if (controller === 'checkbox') {
    return (
      <div className="form-control px-4 py-2">
        <label
          htmlFor={name}
          className="label cursor-pointer justify-start space-x-2"
        >
          {props.children}
          <span className="label-text">{label}</span>
        </label>
        {error && (
          <label htmlFor={name} className="label-text text-error">
            {error}
          </label>
        )}
      </div>
    );
  }
  return (
    <div
      className={`form-control w-full max-w-xs px-4 py-2 ${additionalDivClassName}`}
    >
      <label htmlFor={name} className="label justify-start">
        <span className="label-text pr-1 font-semibold">{label}</span>
        {secondaryLabel && (
          <span className="label-text-alt">({secondaryLabel})</span>
        )}
      </label>
      {props.children}
      {error && (
        <label htmlFor={name} role="error" className="label-text text-error">
          {error}
        </label>
      )}
    </div>
  );
}
