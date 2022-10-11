import React from 'react';
interface iToolTipSquareButton {
  message: string;
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  tooltipClassName?: string;
  btnClassName?: string;
  position?:
    | 'tooltip-left'
    | 'tooltip-right'
    | 'tooltip-top'
    | 'tooltip-bottom';
}
export default function ToolTipSquareButton(
  props: React.PropsWithChildren<iToolTipSquareButton>
) {
  const {
    message,
    children,
    onClick,
    tooltipClassName = '',
    btnClassName = 'btn-sm',
    position = 'tooltip-right',
  } = props;
  return (
    <div
      className={`tooltip ${position} ${tooltipClassName}`}
      data-tip={message}
    >
      <button
        className={`btn btn-square btn-ghost ${btnClassName}`}
        onClick={onClick}
      >
        {children}
      </button>
    </div>
  );
}
