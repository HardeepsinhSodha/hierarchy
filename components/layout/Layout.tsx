import { ReactNode } from 'react';
import MyToast from '../toast/Toast';
import Drawer from './Drawer';
interface props {
  children: ReactNode;
}
export default function Layout(props: props) {
  return (
    <>
      <Drawer>{props.children}</Drawer>
      <MyToast />
    </>
  );
}
