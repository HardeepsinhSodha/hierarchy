import type {
  DetailedHTMLProps,
  HTMLAttributes,
  PropsWithChildren,
} from 'react';

export default function Item({
  children,
  ...rest
}: PropsWithChildren<
  DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
>) {
  return (
    <div className="cursor-pointer" {...rest}>
      {children}
    </div>
  );
}
