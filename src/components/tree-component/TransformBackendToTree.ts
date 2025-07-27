import { TreeItem } from "./TreeComponent";

type BackendNode = {
  id: number;
  label: string;
  numeric_system: string;
  children?: BackendNode[];
};

export function transformBackendToTreeState(
  data: BackendNode[]
): Record<string, TreeItem> {
  const flatTree: Record<string, TreeItem> = {
    root: {
      name: "دليل الحسابات",
      code: "0000",
      children: [],
    },
  };

  let counter = 0;

  const traverse = (node: BackendNode, parentKey: string) => {
    counter++;
    const nodeKey = `node-${counter}`;

    flatTree[nodeKey] = {
      name: node.label,
      code: node.numeric_system,
    };

    flatTree[parentKey].children = flatTree[parentKey].children || [];
    flatTree[parentKey].children!.push(nodeKey);

    if (node.children && node.children.length > 0) {
      flatTree[nodeKey].children = [];
      for (const child of node.children) {
        traverse(child, nodeKey);
      }
    }
  };

  for (const item of data) {
    traverse(item, "root");
  }

  return flatTree;
}
