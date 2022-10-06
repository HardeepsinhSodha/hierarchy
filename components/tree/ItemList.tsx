import type { iTreeProps } from './Tree';
import Tree from './Tree';
export default function ItemList({ root }: iTreeProps) {
  return <Tree root={root} />;
}
