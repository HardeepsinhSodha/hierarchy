import { Alert, Toast } from 'react-daisyui';
import { useAppDispatch, useAppSelector } from '../../hooks/store/utilityHooks';
import { removeAlert, selectAlerts } from './toastSlice';

export default function MyToast() {
  const alerts = useAppSelector(selectAlerts);
  const dispatch = useAppDispatch();

  return (
    <Toast horizontal="end" vertical="bottom">
      {alerts.map((alert, index) => (
        <Alert key={index} status={alert.status}>
          <div className="w-full flex-row justify-between gap-2">
            <h3>{alert.text}</h3>
          </div>
          <button
            className="btn btn-ghost"
            onClick={() => dispatch(removeAlert(index))}
            data-test-id="remove-alert"
          >
            X
          </button>
        </Alert>
      ))}
    </Toast>
  );
}
