import { TreeProps, Tree } from "rsuite";

interface TabsTreeProps extends TreeProps {}

export default function TabsTree({ ...props }: TabsTreeProps) {
  return <Tree {...props} />;
}
