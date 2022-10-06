import Drawer from './Drawer';
interface props {
  children: any;
}
export default function Layout(props: props) {
  return <Drawer>{props.children}</Drawer>;
}
